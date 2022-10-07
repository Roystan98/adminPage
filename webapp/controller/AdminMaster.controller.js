sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "com/lti/admin/model/formatter",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, formatter) {
        "use strict";

        return Controller.extend("com.lti.admin.controller.AdminMaster", {
            formatter: formatter,
            onInit: function () {
                this.compCode = "";
                this.location = "";
                this.department = "";
                this.selectedIndex = "";
                this.startDate = "";

                this.onLoadAdminSelectionView();
            },
            onRowHeaderClicked: function (oEvent) {
                var oSelected = oEvent.getSource().getSelectedRows()[0].getProperty("title");
                var oPayload = this.getView().byId("PC1").getModel("oPlModel").oData[0].people.filter(element => element.empId === oSelected);
                    var record = {};
                    record.startDate = this.getView().byId("PC1").getModel("oPlModel").oData[0].startDate;
                    oPayload.push(record);
                    this.getView().byId("PC1").setVisible(false);
                    this.getView().byId("SPC1").setVisible(true);
                    var oSingleCalModel = new sap.ui.model.json.JSONModel(oPayload);
                    this.getView().byId("SPC1").setModel(oSingleCalModel,"oSingleCalModel");
                    var oKey = this.getView().byId("empCombo2").getModel("oEmpModel").oData.filter(element => element.value === oSelected)[0].key;
                    this.getView().byId("empCombo2").setSelectedKey(oKey);
            },
            onEmpChange: function (oEvent) {
                var oSelected = oEvent.getSource().getSelectedItem().getProperty("text");
                if (oSelected === "All") {
                    this.getView().byId("PC1").setVisible(true);
                    this.getView().byId("SPC1").setVisible(false);
                    this.getView().byId("empCombo").setSelectedKey("000");
                } else {
                    var oPayload = this.getView().byId("PC1").getModel("oPlModel").oData[0].people.filter(element => element.empId === oSelected);
                    var record = {};
                    record.startDate = this.getView().byId("PC1").getModel("oPlModel").oData[0].startDate;
                    oPayload.push(record);
                    this.getView().byId("PC1").setVisible(false);
                    this.getView().byId("SPC1").setVisible(true);
                    var oSingleCalModel = new sap.ui.model.json.JSONModel(oPayload);
                    this.getView().byId("SPC1").setModel(oSingleCalModel,"oSingleCalModel");
                    this.getView().byId("empCombo2").setSelectedKey(oEvent.getSource().getSelectedKey());
                }
                // this.getView().byId("PC1").getModel("oPlModel").oData[0].people.filter(element => element.empId === oEvent.getParameter("newValue"))
            },
            //   onAfterRendering: function () {
            //     this.onSubmitPress();
            //   },
            onLoadAdminSelectionView: function () {
                var that = this;
                var oView = this.getView();
                this.oDialog = oView.byId("idAdminSelectionView");
                if (!this.oDialog) {
                    this.oDialog = sap.ui.xmlfragment(
                        oView.getId(),
                        "com.lti.admin.view.fragment.AdminSelection",
                        this
                    );
                    oView.addDependent(this.oDialog);
                }
                this.oDialog.open();
                this.getView().byId("curMonthDP1").setValue(this.getCurrentMonth());
                this.getView().byId("pastMonthDP2").setValue(this.getPastMonth());
                //var sServiceUrlodataservice = this.getOwnerComponent().getModel("odatamodelcheckprojectid").sServiceUrl;
                // var oDataModelConfigNotificationtaskdata = new sap.ui.model.odata.ODataModel(sServiceUrlodataservice, {
                // 	json: false,
                // 	loadMetadataAsync: true
                // });
                // this.getView().setModel(oDataModelConfigNotificationtaskdata, "oDataModelConfigNotificationtaskdata");

                // var projectmodel = new sap.ui.model.json.JSONModel();
                // this.getView().setModel(projectmodel, "projectmodel");
                // this.getView().getModel("oDataModelConfigNotificationtaskdata").read("/ProjectSet", null,
                // 	null, true,
                // 	function (oData1, oResponse) {
                // 		that.getView().getModel("projectmodel").setData(oData1.results);
                // 		that.oDialog.open();
                // 	},
                // 	function (oError) {
                // 		sap.m.MessageBox
                // 			.error(oError.Message);
                // 	});
            },
            onExitBtnPress: function () {
                var oTable = this.getView().byId("employeeTbl");
                var oEmpModel = new sap.ui.model.json.JSONModel();
                oTable.setModel(oEmpModel, "employeeModel");
                this.onLoadAdminSelectionView();
            },
            setStartDate: function () {
                var that = this;
                if (this.selectedIndex == 0) {
                    var oYear = new Date().getFullYear();
                    var oMonth = new Date().getMonth();
                    startDateSetter(oYear, oMonth);
                } else if (this.selectedIndex == 1) {
                    var oYear = new Date().getFullYear();
                    var oMonth = new Date().getMonth();
                    startDateSetter(oYear, oMonth - 1);
                } else if (this.selectedIndex == 2) {
                    var sDate = this.getView().byId("DRS3").getValue().split("-")[0];
                    var oYear = new Date(sDate).getFullYear();
                    var oMonth = new Date(sDate).getMonth();
                    startDateSetter(oYear, oMonth);
                }
                function startDateSetter(yr, mnth) {
                    that.startDate = new Date(yr.toString(), mnth.toString(), "01");
                    //console.log(that.startDate);
                }
            },
            onSubmitPress: function (oEvent) {
                if (this.allDetailsAdded()) {
                    // if (true) {
                    this.setStartDate();
                    this.oDialog.close();
                    this.oDialog.destroy();
                    //console.log("check:"+this.startDate);
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel = this.getView().getModel("empData");
                    var employeeData = oModel.oData.Details.filter(
                        (element) =>
                            element.companyCode === this.compCode &&
                            element.location === this.location &&
                            element.department === this.department
                    );
                    //   var employeeData = oModel.oData.Details.filter(
                    //     (element) =>
                    //       element.companyCode === "C001" &&
                    //       element.location === "Mumbai" &&
                    //       element.department === "Digital"
                    //   );
                    var oTable = this.getView().byId("employeeTbl");
                    var oEmpModel = new sap.ui.model.json.JSONModel(employeeData);
                    oTable.setModel(oEmpModel, "employeeModel");
                } else {
                    MessageBox.error("Please Add all Details");
                }
            },
            allDetailsAdded: function () {
                this.compCode = this.getView()
                    .byId("fragCompCombo")
                    .getProperty("value");
                this.location = this.getView()
                    .byId("fragLocCombo")
                    .getProperty("value");
                this.department = this.getView()
                    .byId("fragDeptCombo")
                    .getProperty("value");
                this.selectedIndex = this.getView().byId("GroupA").getSelectedIndex();
                if (this.selectedIndex != 2) {
                    if (
                        this.compCode !== "" &&
                        this.location !== "" &&
                        this.department !== ""
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    var val = this.getView().byId("DRS3").getValue();
                    if (val === "") {
                        return false;
                    } else {
                        if (
                            this.compCode !== "" &&
                            this.location !== "" &&
                            this.department !== ""
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            },
            getCurrentMonth: function () {
                return this.getMonthString(new Date().getMonth());
            },
            getPastMonth: function () {
                return this.getMonthString(new Date().getMonth() - 1);
            },
            getMonthString: function (month) {
                var monthStringArr = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ];
                return monthStringArr[month];
            },
            onShiftPlanningPress: function () {
                var oTable = this.getView().byId("employeeTbl");
                var oIndices = oTable.getSelectedIndices();
                var comboPayload = [];
                var comboRecord = {};
                comboRecord.key = "000";
                comboRecord.value = "All";
                comboPayload.push(comboRecord);
                for (var i = 0; i < oIndices.length; i++) {
                    comboRecord = {};
                    comboRecord.key = oTable
                        .getContextByIndex(oIndices[i])
                        .getObject().empId;
                    comboRecord.value = oTable
                        .getContextByIndex(oIndices[i])
                        .getObject().empId;
                    comboPayload.push(comboRecord);
                }

                var payload = [];
                var record = {};
                record.startDate = this.startDate;
                record.people = [];
                for (var i = 0; i < oIndices.length; i++) {
                    var oAppoints = oTable.getContextByIndex(oIndices[i]).getObject()
                        .appoint.length;
                    var record2 = {};
                    record2.empId = oTable
                        .getContextByIndex(oIndices[i])
                        .getObject().empId;
                    if (oAppoints > 0) {
                        record2.Appointments = [];
                        for (var j = 0; j < oAppoints; j++) {
                            var record3 = {};
                            var stdate = oTable.getContextByIndex(oIndices[i]).getObject()
                                .appoint[j].sdate;
                            var ltdate = oTable.getContextByIndex(oIndices[i]).getObject()
                                .appoint[j].edate;
                            record3.sdate = stdate;
                            record3.ldate = ltdate;
                            record3.type = oTable
                                .getContextByIndex(oIndices[i])
                                .getObject().appoint[j].type;
                            record3.text = oTable
                                .getContextByIndex(oIndices[i])
                                .getObject().appoint[j].stext;
                            record2.Appointments.push(record3);
                        }
                    }

                    record.people.push(record2);
                }
                payload.push(record);
                var oData = { payload };
                console.log(oData);
                oTable.setVisible(false);
                this.getView().byId("mBackBtn").setVisible(true);
                this.getView().byId("mUpBtn").setVisible(true);
                this.getView().byId("plCal").setVisible(true);
                this.getView().byId("exitBtn").setVisible(false);
                var oPl = this.getView().byId("PC1");
                var oEmpCombo = this.getView().byId("empCombo");
                var oEmpCombo2 = this.getView().byId("empCombo2");
                //oPl.setVisible(true);
                var oPlCalModel = new sap.ui.model.json.JSONModel(payload);
                oPl.setModel(oPlCalModel, "oPlModel");
                var oEmpComModel = new sap.ui.model.json.JSONModel(comboPayload);
                oEmpCombo2.setModel(oEmpComModel, "oEmpModel");
                // var oEmpComModel = new sap.ui.model.json.JSONModel(comboPayload);
                oEmpCombo.setModel(oEmpComModel, "oEmpModel");
            },

            onBackPress: function () {
                this.getView().byId("PC1").selectAllRows(false);
                this.getView().byId("exitBtn").setVisible(true);
                this.getView().byId("mBackBtn").setVisible(false);
                this.getView().byId("mUpBtn").setVisible(false);
                this.getView().byId("plCal").setVisible(false);
                this.getView().byId("employeeTbl").setVisible(true);
                this.getView().byId("employeeTbl").clearSelection();
                this.getView().byId("plEditBtn").setIcon("sap-icon://edit");
                this.getView().byId("plEditBtn").setType("Default");
                this.getView().byId("vStDate").setEditable(false);
                this.getView().byId("vEDate").setEditable(false);
                this.getView().byId("vTitle").setEditable(false);
                this.getView().byId("vText").setEditable(false);
                this.getView().byId("shDetBtn").setVisible(false);
                this.getView().byId("shDelBtn").setVisible(true);
                this.getView().byId("shiftDetails").setVisible(false);
            },
            onEditPlanPress: function (oEvent) {
                if (oEvent.getSource().getPressed()) {
                    this.getView().byId("plEditBtn").setIcon("sap-icon://decline");
                    this.getView().byId("plEditBtn").setType("Reject");
                    this.getView().byId("vStDate").setEditable(true);
                    this.getView().byId("vEDate").setEditable(true);
                    this.getView().byId("vTitle").setEditable(true);
                    this.getView().byId("vText").setEditable(true);
                    this.getView().byId("shDetBtn").setVisible(true);
                    this.getView().byId("shDelBtn").setVisible(false);
                } else {
                    this.getView().byId("plEditBtn").setIcon("sap-icon://edit");
                    this.getView().byId("plEditBtn").setType("Default");
                    this.getView().byId("vStDate").setEditable(false);
                    this.getView().byId("vEDate").setEditable(false);
                    this.getView().byId("vTitle").setEditable(false);
                    this.getView().byId("vText").setEditable(false);
                    this.getView().byId("shDetBtn").setVisible(false);
                    this.getView().byId("shDelBtn").setVisible(true);
                }
            },
            handleAppointmentSelect: function (oEvent) {
                var oAppointment = oEvent.getParameter("appointment");
                this.getView().byId("shiftDetails").setVisible(true);
                this.getView()
                    .byId("vStDate")
                    .setValue(new Date(oAppointment.getProperty("startDate")));
                this.getView()
                    .byId("vEDate")
                    .setValue(new Date(oAppointment.getProperty("endDate")));
                this.getView()
                    .byId("vTitle")
                    .setValue(oAppointment.getProperty("title"));
                this.getView().byId("vText").setValue(oAppointment.getProperty("text"));
            },
            getShiftTypeDet: function () {
                var oIndex = this.getView().byId("GroupB").getSelectedIndex();
                if (oIndex === 0) {
                    return ["Early", "Type06"];
                } else if (oIndex === 1) {
                    return ["Mid", "Type01"];
                } else if (oIndex === 2) {
                    return ["Late", "Type08"];
                }
            },
            handleIntervalSelect: function (oEvent) {
                var oPC = oEvent.getSource(),
                    oStartDate = oEvent.getParameter("startDate"),
                    oEndDate = oEvent.getParameter("endDate"),
                    shiftDet = this.getShiftTypeDet(),
                    oRow = oEvent.getParameter("row"),
                    oModel = this.getView().byId("PC1").getModel("oPlModel"),
                    oData = oModel.getData(),
                    iIndex = -1,
                    oAppointment = {
                        sdate: new Date(oStartDate).toLocaleDateString(),
                        ldate: new Date(oEndDate).toLocaleDateString(),
                        text: shiftDet[0],
                        type: shiftDet[1],
                    },
                    aSelectedRows,
                    i;

                if (oRow) {
                    iIndex = oPC.indexOfRow(oRow);
                    oData[0].people[iIndex].Appointments.push(oAppointment);
                } else {
                    aSelectedRows = oPC.getSelectedRows();
                    for (i = 0; i < aSelectedRows.length; i++) {
                        iIndex = oPC.indexOfRow(aSelectedRows[i]);
                        oData[0].people[iIndex].Appointments.push(oAppointment);
                    }
                }
                oModel.setData(oData);
            },
        });
    }
);

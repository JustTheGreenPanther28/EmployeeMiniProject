package com.employee.response;

public class ReportEmployee {

	private String reportToName;
	private String reportToId;

	public ReportEmployee() {

	}

	public ReportEmployee( String reportToName, String reportToId) {
		super();
		this.reportToName = reportToName;
		this.reportToId = reportToId;
	}

	public String getReportToName() {
		return reportToName;
	}

	public void setReportToName(String reportToName) {
		this.reportToName = reportToName;
	}

	public String getReportToId() {
		return reportToId;
	}

	public void setReportToId(String reportToId) {
		this.reportToId = reportToId;
	}

}

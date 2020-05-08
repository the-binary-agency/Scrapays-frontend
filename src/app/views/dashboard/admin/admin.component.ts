import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

//  lineChart
  public lineChartData: Array<any> = [
    {
      data: [
        50,
        150,
        60,
        140], label: "Listing Deals Done"
    }
  ];

  public lineChartLabels: Array<any> = [
    "1 Dec",
    "8 Dec",
    "18 Dec",
    "31 Dec"
  ];
  public lineChartOptions: any = {
    animation: false,
    responsive: true
  };
  public lineChartColours: Array<any> = [
    {
      // grey
      backgroundColor: "rgba(148,159,177,0.2)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)"
    },
    {
      // dark grey
      backgroundColor: "rgba(77,83,96,0.2)",
      borderColor: "rgba(77,83,96,1)",
      pointBackgroundColor: "rgba(77,83,96,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(77,83,96,1)"
    },
    {
      // grey
      backgroundColor: "rgba(148,159,177,0.2)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)"
    }
  ];
  public lineChartLegend = true;
  public lineChartType = "line";

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public doughnutChartLabels = ['In Progress', 'New Listing', 'Completed'];
  public doughnutChartData = [120, 150, 180];
  public doughnutChartType = 'doughnut';
  public doughnutChartColors: Array<any> = [
    {
      backgroundColor: ["rgba(240, 255, 0, 1)", 'rgba(0, 230, 64, 1)', 'rgba(207, 0, 15, 1)'],
    }
  ];
  public doughnutChartOptions = { 
    legend: { position: 'right' }
  };

}

import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "src/app/services/auth/api.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { NavService } from "src/app/services/general/nav.service";
import { TokenService } from "src/app/services/auth/token.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { Router } from "@angular/router";

export interface Pickup {
  id: string;
  userID: string;
  assignedCollector: string;
  address: string;
  materials: string;
  schedule: string;
  status: string;
  time: string;
}

@Component({
  selector: "app-pickup-requests",
  templateUrl: "./pickup-requests.component.html",
  styleUrls: ["./pickup-requests.component.css"],
})
export class PickupRequestsComponent implements OnInit {
  displayedColumns: string[] = [
    "id",
    "userID",
    "assignedCollector",
    "address",
    "materials",
    "schedule",
    "status",
    "time",
  ];
  dataSource: MatTableDataSource<Pickup>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selection = new SelectionModel<Pickup>(true, []);

  constructor(
    private api: ApiService,
    private Auth: AuthService,
    private nav: NavService,
    private token: TokenService,
    private router: Router
  ) {}

  Pickups: any[] = [];
  Admins: any[] = [];
  task: any;
  subtask: any;
  allComplete: boolean = false;
  deleteLoading: boolean;
  collectorToAssign: any = {};
  loading: boolean;

  ngOnInit(): void {
    this.getPickups();
    this.getCollectorToAssign();
  }

  getPickups() {
    this.Auth.getAllPickupRequests(this.token.phone).subscribe(
      (data) => this.handleResponse(data),
      (error) => this.handleError(error)
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  processForm() {
    var formData = {
      id: this.token.phone,
      userType: "Enterprise",
      orderBy: "",
    };
    return formData;
  }

  handleResponse(data) {
    this.Pickups = data.pickups;
    this.dataSource = new MatTableDataSource(this.Pickups);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loading = false;
  }

  handleError(error) {
    console.log(error);
  }

  formatMaterials(mat) {
    return JSON.parse(mat);
  }

  formatSchedule(sch) {
    let schedule = JSON.parse(sch);
    return (
      schedule.scheduleTime +
      " | " +
      schedule.scheduleDate.day +
      "-" +
      schedule.scheduleDate.month +
      "-" +
      schedule.scheduleDate.year
    );
  }

  getCollectorToAssign() {
    let collID = this.router.url.split("assign_to_");
    if (collID) {
      let form = this.processCollForm(collID[1]);
      this.Auth.getCollectorWithLog(form).subscribe(
        (res) => this.handleCollFormResponse(res),
        (err) => this.handleCollFormError(err)
      );
    }
  }

  handleCollFormResponse(res) {
    this.collectorToAssign = res.collector;
  }

  handleCollFormError(err) {
    console.log(err);
  }

  processCollForm(id) {
    let formDataa = {
      adminPhone: this.token.phone,
      collectorID: id,
    };
    return formDataa;
  }

  assignToCollector(pickup) {
    if (pickup.assignedCollector == null) {
      this.loading = true;
      let form = this.processAssignForm(pickup);
      this.Auth.assignToCollector(form).subscribe(
        (res) => this.handleAssignResponse(res),
        (err) => this.handleAssignError(err)
      );
    }
  }

  handleAssignResponse(res) {
    this.getPickups();
  }

  handleAssignError(err) {
    console.log(err);
    this.loading = false;
  }

  processAssignForm(pickup) {
    let formData = {
      adminPhone: this.token.phone,
      collectorID: this.collectorToAssign.id,
      pickup: pickup,
    };
    return formData;
  }

  gotoSingleUser(user) {
    this.nav.navigate(
      "/dashboard/enterprise/ent_" + user.phone.split("+234")[1],
      user
    );
  }

  gotoSingleAdmin(admin) {
    this.nav.navigate("/dashboard/users/Admin_" + admin.id, admin);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.Pickups.length > 0) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Pickup): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.id + 1
    }`;
  }

  deleteUser(phone) {
    this.deleteLoading = true;
    console.log("User " + phone);
    let form = {
      adminPhone: this.token.phone,
      deletePhone: phone,
    };
    this.Auth.deleteUser(form).subscribe(
      (data) => this.handleDeleteResponse(data),
      (error) => this.handleDeleteError(error)
    );
  }

  handleDeleteResponse(data) {
    this.deleteLoading = false;
    console.log(data.success);
  }

  handleDeleteError(error) {
    this.deleteLoading = false;
  }

  updateAllComplete() {
    this.allComplete =
      this.Pickups != null && this.Pickups.every((t) => t.checked);
  }

  someComplete(): boolean {
    return (
      this.Pickups.filter((t) => t.checked).length > 0 && !this.allComplete
    );
  }

  setAll(checked: boolean) {
    this.allComplete = checked;
    if (this.Pickups == null) {
      return;
    }
    this.Pickups.forEach((t) => (t.checked = checked));
  }
}

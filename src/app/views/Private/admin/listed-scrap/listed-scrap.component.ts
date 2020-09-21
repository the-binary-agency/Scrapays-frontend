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
  firstName: string;
  lastName: string;
  phone: number;
  email: string;
  materialImages: string;
  materialLocation: string;
  materialDescription: string;
  created_at: string;
}

@Component({
  selector: "app-listed-scrap",
  templateUrl: "./listed-scrap.component.html",
  styleUrls: ["./listed-scrap.component.css"],
})
export class ListedScrapComponent implements OnInit {
  displayedColumns: string[] = [
    "select",
    "name",
    "location",
    "phone",
    "description",
    "accept",
    "reject",
    "more",
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

  ngOnInit(): void {
    this.getAllListedSrap();
  }

  ListedScraps: any[] = [];
  MaterialDescriptions: any[] = [];
  Admins: any[] = [];
  task: any;
  subtask: any;
  allComplete: boolean = false;
  deleteLoading: boolean;
  collectorToAssign: any = {};
  loading: boolean;

  getAllListedSrap() {
    this.api.getListedScrap().subscribe(
      (res) => {
        this.handleResponse(res);
      },
      (err) => console.log(err)
    );
  }

  gotoSingle(listedscrap) {
    this.nav.navigate(
      "/dashboard/listedScrap/scrap_" + listedscrap.id,
      listedscrap
    );
  }

  handleResponse(data) {
    data.map((list) => {
      var images = JSON.parse(list.materialImages);
      var descriptions = JSON.parse(list.materialDescription);
      let lscrap = {
        id: list.id,
        firstName: list.firstName,
        lastName: list.lastName,
        phone: list.phone,
        email: list.email,
        materialImages: images,
        materialLocation: list.materialLocation,
        materialDescription: descriptions,
        created_at: list.created_at,
      };
      this.ListedScraps.push(lscrap);
    });
    this.dataSource = new MatTableDataSource(this.ListedScraps);
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

  handleAssignResponse(res) {
    // this.getPickups();
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
    if (this.ListedScraps.length > 0) {
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
      this.ListedScraps != null && this.ListedScraps.every((t) => t.checked);
  }

  someComplete(): boolean {
    return (
      this.ListedScraps.filter((t) => t.checked).length > 0 && !this.allComplete
    );
  }

  setAll(checked: boolean) {
    this.allComplete = checked;
    if (this.ListedScraps == null) {
      return;
    }
    this.ListedScraps.forEach((t) => (t.checked = checked));
  }

  offerPrice() {}
}

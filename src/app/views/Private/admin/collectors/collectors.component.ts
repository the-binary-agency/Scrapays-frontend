import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "src/app/services/auth/api.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { NavService } from "src/app/services/general/nav.service";
import { TokenService } from "src/app/services/auth/token.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";

export interface User {
  avatarImage: string;
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  userable_type: string;
  totalTonnage: string;
  totalEarnings: string;
  totalWithdrawals: string;
  userable: {};
}

@Component({
  selector: "app-collectors",
  templateUrl: "./collectors.component.html",
  styleUrls: ["./collectors.component.css"],
})
export class CollectorsComponent implements OnInit {
  displayedColumns: string[] = [
    "select",
    "companyName",
    "id",
    "lastLogin",
    "totalTonnage",
    "status",
    "toggle",
    "menu",
  ];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selection = new SelectionModel<User>(true, []);

  constructor(
    private api: ApiService,
    private Auth: AuthService,
    private nav: NavService,
    private token: TokenService
  ) {}

  Users: any[] = [];
  Admins: any[] = [];
  task: any;
  subtask: any;
  allComplete: boolean = false;
  deleteLoading: boolean;

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    var form = this.processForm();
    this.Auth.getAllUsers(form).subscribe(
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
      userType: "Collector",
      orderBy: "",
    };
    return formData;
  }

  handleResponse(data) {
    this.Users = data;
    // this.Users.map((user) => {
    //   user["checked"] = false;
    // });
    this.dataSource = new MatTableDataSource(this.Users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  handleError(error) {
    console.log(error);
  }

  gotoSingleUser(user) {
    this.nav.navigate(
      "/dashboard/collector/ent_" + user.phone.split("+234")[1],
      user
    );
  }

  gotoSingleAdmin(admin) {
    this.nav.navigate("/dashboard/users/Admin_" + admin.id, admin);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.Users.length > 0) {
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
  checkboxLabel(row?: User): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.id + 1
    }`;
  }

  activateCollector(phone) {
    this.deleteLoading = true;
    let form = {
      adminPhone: this.token.phone,
      collectorPhone: phone,
      approvedAsCollector: true,
    };
    this.Auth.toggleCollectorStatus(form).subscribe(
      (data) => this.handleCollectorToggleResponse(data),
      (error) => this.handleCollectorToggleError(error)
    );
  }

  deactivateCollector(phone) {
    this.deleteLoading = true;
    let form = {
      adminPhone: this.token.phone,
      collectorPhone: phone,
      approvedAsCollector: false,
    };
    this.Auth.toggleCollectorStatus(form).subscribe(
      (data) => this.handleCollectorToggleResponse(data),
      (error) => this.handleCollectorToggleError(error)
    );
  }

  handleCollectorToggleResponse(data) {
    this.deleteLoading = false;
    this.getUsers();
    console.log(data.success);
  }

  handleCollectorToggleError(error) {
    this.deleteLoading = false;
  }

  deleteUser(phone) {
    this.deleteLoading = true;
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
    this.getUsers();
    console.log(data.success);
  }

  handleDeleteError(error) {
    this.deleteLoading = false;
  }

  updateAllComplete() {
    this.allComplete = this.Users != null && this.Users.every((t) => t.checked);
  }

  someComplete(): boolean {
    return this.Users.filter((t) => t.checked).length > 0 && !this.allComplete;
  }

  setAll(checked: boolean) {
    this.allComplete = checked;
    if (this.Users == null) {
      return;
    }
    this.Users.forEach((t) => (t.checked = checked));
  }
}

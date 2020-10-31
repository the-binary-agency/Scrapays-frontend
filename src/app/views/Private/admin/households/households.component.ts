import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/auth/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavService } from 'src/app/services/general/nav.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

export interface User {
  avatar_image: string;
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  userable_type: string;
  total_tonnage: string;
  total_earnings: string;
  total_withdrawals: string;
  userable: {};
}

@Component({
  selector: 'app-households',
  templateUrl: './households.component.html',
  styleUrls: ['./households.component.css'],
})
export class HouseholdsComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'name',
    'id',
    'last_login',
    'total_tonnage',
    'total_earnings',
    'total_withdrawals',
    'created_at',
    'menu',
  ];
  dataSource: MatTableDataSource<User>;
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
  currentPage = 1;
  collectionSize = 0;
  pageSize = 1;

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(query?) {
    this.Auth.getAllUsers('households', query).subscribe(
      (res) => this.handleResponse(res),
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

  handleResponse(res) {
    this.currentPage = res.current_page;
    this.collectionSize = res.total;
    this.pageSize = res.per_page;
    this.Users = res.data;
    this.dataSource = new MatTableDataSource(this.Users);
    this.dataSource.sort = this.sort;
  }

  handleError(error) {
    console.log(error);
  }

  gotoSingleUser(user) {
    this.nav.navigate('/dashboard/household/hd_' + user.id, user);
  }

  gotoSingleAdmin(admin) {
    this.nav.navigate('/dashboard/users/Admin_' + admin.id, admin);
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
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
  }

  deleteUser(id) {
    this.deleteLoading = true;
    this.Auth.deleteUser('households', id).subscribe(
      (res) => this.handleDeleteResponse(res),
      (error) => this.handleDeleteError(error)
    );
  }

  handleDeleteResponse(data) {
    this.deleteLoading = false;
    this.getUsers();
    console.log(data);
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

  changePage() {
    let query = `&page=${this.currentPage}`;
    this.getUsers(query);
  }
}

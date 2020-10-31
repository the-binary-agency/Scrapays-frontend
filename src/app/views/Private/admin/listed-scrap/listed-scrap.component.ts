import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/auth/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavService } from 'src/app/services/general/nav.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

export interface Pickup {
  id: string;
  first_name: string;
  last_name: string;
  phone: number;
  email: string;
  material_images: string;
  material_location: string;
  material_description: string;
  created_at: string;
}

@Component({
  selector: 'app-listed-scrap',
  templateUrl: './listed-scrap.component.html',
  styleUrls: ['./listed-scrap.component.css'],
})
export class ListedScrapComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'name',
    'location',
    'phone',
    'description',
    'accept',
    'reject',
    'more',
  ];
  dataSource: MatTableDataSource<Pickup>;

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
  currentPage = 1;
  collectionSize = 0;
  pageSize = 1;

  getAllListedSrap(query?) {
    this.api.getListedScrap(query).subscribe(
      (res) => {
        this.handleResponse(res);
      },
      (err) => console.log(err.error.error)
    );
  }

  gotoSingle(listedscrap) {
    this.nav.navigate(
      '/dashboard/listedScrap/scrap_' + listedscrap.id,
      listedscrap
    );
  }

  handleResponse(res) {
    this.currentPage = res.current_page;
    this.collectionSize = res.total;
    this.pageSize = res.per_page;
    res.data.map((list) => {
      var images = JSON.parse(list.material_images);
      var descriptions = JSON.parse(list.material_description);
      let lscrap = {
        id: list.id,
        first_name: list.first_name,
        last_name: list.last_name,
        phone: list.phone,
        email: list.email,
        material_images: images,
        material_location: list.material_location,
        material_description: descriptions,
        created_at: list.created_at,
      };
      this.ListedScraps.push(lscrap);
    });
    this.dataSource = new MatTableDataSource(this.ListedScraps);
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
      schedule.schedule_time +
      ' | ' +
      schedule.schedule_date.day +
      '-' +
      schedule.schedule_date.month +
      '-' +
      schedule.schedule_date.year
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
      adminPhone: this.token._id,
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
      adminPhone: this.token._id,
      collectorID: this.collectorToAssign.id,
      pickup: pickup,
    };
    return formData;
  }

  gotoSingleUser(user) {
    this.nav.navigate(
      '/dashboard/enterprise/ent_' + user.phone.split('+234')[1],
      user
    );
  }

  gotoSingleAdmin(admin) {
    this.nav.navigate('/dashboard/users/Admin_' + admin.id, admin);
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

  deleteUser(id) {
    this.deleteLoading = true;
    this.Auth.deleteUser('users', id).subscribe(
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

  changePage() {
    let query = `&page=${this.currentPage}`;
    this.getAllListedSrap(query);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/auth/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavService } from 'src/app/services/general/nav.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

export interface Pickup {
  id: string;
  producer_id: string;
  address: string;
  materials: string;
  schedule: string;
  status: string;
}

@Component({
  selector: 'app-assigned-pickups',
  templateUrl: './assigned-pickups.component.html',
  styleUrls: ['./assigned-pickups.component.css'],
})
export class AssignedPickupsComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'id',
    'producer_id',
    'address',
    'materials',
    'schedule',
    'status',
    'created_at',
  ];
  dataSource: MatTableDataSource<Pickup>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selection = new SelectionModel<Pickup>(true, []);

  constructor(
    private api: ApiService,
    private Auth: AuthService,
    private nav: NavService,
    private token: TokenService
  ) {}
  task: any;
  subtask: any;
  allComplete: boolean = false;
  assignedRequests = [];
  usersLoading: boolean;
  currentPage = 1;
  collectionSize = 0;
  pageSize = 1;

  ngOnInit(): void {
    this.getAssignedRequests();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAssignedRequests(query?) {
    this.Auth.getAssignedRequests(this.token._id, query).subscribe(
      (res: any) => this.handleResponse(res),
      (error) => console.log(error)
    );
  }

  handleResponse(res) {
    this.currentPage = res.current_page;
    this.collectionSize = res.total;
    this.pageSize = res.per_page;
    this.assignedRequests = res.data;
    this.dataSource = new MatTableDataSource(this.assignedRequests);
    this.dataSource.sort = this.sort;
  }

  handleError(error) {
    console.log(error);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.assignedRequests.length > 0) {
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
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
  }

  updateAllComplete() {
    this.allComplete =
      this.assignedRequests != null &&
      this.assignedRequests.every((t) => t.checked);
  }

  someComplete(): boolean {
    return (
      this.assignedRequests.filter((t) => t.checked).length > 0 &&
      !this.allComplete
    );
  }

  setAll(checked: boolean) {
    this.allComplete = checked;
    if (this.assignedRequests == null) {
      return;
    }
    this.assignedRequests.forEach((t) => (t.checked = checked));
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

  changePage() {
    let query = `&page=${this.currentPage}`;
    this.getAssignedRequests(query);
  }
}

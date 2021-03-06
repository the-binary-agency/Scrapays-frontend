import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/auth/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavService } from 'src/app/services/general/nav.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export interface Pickup {
  id: string;
  producer_phone: string;
  assigned_collector: string;
  address: string;
  materials: string;
  schedule: string;
  status: string;
  time: string;
}

@Component({
  selector: 'app-pickup-requests',
  templateUrl: './pickup-requests.component.html',
  styleUrls: ['./pickup-requests.component.css'],
})
export class PickupRequestsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'producer_phone',
    'producer_name',
    'assigned_collector',
    'address',
    'materials',
    'schedule',
    'status',
    'time',
  ];
  dataSource: MatTableDataSource<Pickup>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('assignModal') private assignModal;
  selection = new SelectionModel<Pickup>(true, []);

  constructor(
    private api: ApiService,
    private Auth: AuthService,
    private nav: NavService,
    private modal: NgbModal,
    private token: TokenService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  Pickups: any[] = [];
  Status = 'All';
  task: any;
  subtask: any;
  allComplete: boolean = false;
  deleteLoading: boolean;
  collectorToAssign: any = {};
  loading: boolean;
  assignNotification = {
    title: '',
    body: '',
  };

  currentPage = 1;
  collectionSize = 0;
  pageSize = 1;

  ngOnInit(): void {
    this.getPickups();
    this.getCollectorToAssign();
  }

  getPickups(query?: String) {
    this.Auth.getAllPickupRequests(query).subscribe(
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
    this.Pickups = res.data;
    this.currentPage = res.current_page;
    this.collectionSize = res.total;
    this.pageSize = res.per_page;
    this.dataSource = new MatTableDataSource(this.Pickups);
    this.dataSource.sort = this.sort;
    this.loading = false;
  }

  handleError(error) {
    console.log(error.error);
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

  getCollectorToAssign() {
    let collID = this.router.url.split('assign_to_');
    if (collID[1]) {
      this.Auth.getCollectorDetails(collID[1]).subscribe(
        (res: any) => this.handleCollFormResponse(res.data),
        (err) => this.handleCollFormError(err)
      );
    }
  }

  handleCollFormResponse(data) {
    this.collectorToAssign = data;
  }

  handleCollFormError(err) {
    console.log(err.error.error);
  }

  assignToCollector(pickup) {
    if (this.collectorToAssign.id) {
      if (pickup.assigned_collector == null) {
        this.loading = true;
        let form = this.processAssignForm(pickup);
        this.Auth.assignToCollector(form).subscribe(
          (res: any) => this.handleAssignResponse(res.data),
          (err) => this.handleAssignError(err)
        );
      }
    }
  }

  handleAssignResponse(data) {
    this.showAssignAlert(data);
    this.getPickups('status=Pending');
  }

  handleAssignError(err) {
    console.log(err);
    this.loading = false;
  }

  processAssignForm(pickup) {
    let formData = {
      collector_id: this.collectorToAssign.id,
      pickup_id: pickup.id,
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
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
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

  showAssignAlert(data) {
    this.assignNotification.title = 'Success';
    this.assignNotification.body = data;
    this.modal.open(this.assignModal, { centered: true, size: 'md' });
  }

  changePage() {
    let query = `status=${this.Status}&page=${this.currentPage}`;
    if (this.Status == 'All') query = `page=${this.currentPage}`;
    this.getPickups(query);
  }

  onSelectSort(e) {
    let query = `status=${e.target.value}`;
    if (e.target.value == 'All') query = '';
    this.getPickups(query);
  }
}

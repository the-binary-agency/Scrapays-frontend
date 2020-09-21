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
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: number;
  created_at: string;
}

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.css"],
})
export class MessagesComponent implements OnInit {
  @ViewChild("viewMessage") private viewMessage;
  @ViewChild("replyMessage") private replyMessage;
  @ViewChild("deleteModal") private deleteModal;

  displayedColumns: string[] = [
    "select",
    "name",
    "messageTitle",
    "messageBody",
    "date",
    "more",
  ];
  dataSource: MatTableDataSource<Message>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selection = new SelectionModel<Message>(true, []);

  constructor(
    private api: ApiService,
    private Auth: AuthService,
    private nav: NavService,
    private token: TokenService,
    private modal: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAllContactMessages();
  }

  ReplyForm: FormGroup;
  Messages: any[] = [];
  selectedMessage: any = {};
  replyToSend = {
    msgID: "",
    msgEmail: "",
    as: "",
    cc: "",
    message: "",
  };
  replyLoading: boolean = false;
  replyRes: null;
  allComplete: boolean = false;
  deleteLoading: boolean;
  loading: boolean;
  validation_messages = {
    as: [{ type: "required", message: "A 'reply as' is required." }],
    cc: [{ type: "pattern", message: "Please enter a valid email" }],
    message: [{ type: "required", message: "A message is required." }],
  };
  deleteNotification = {
    title: "",
    body: "",
  };

  initForm() {
    this.ReplyForm = this.formBuilder.group({
      as: new FormControl("Admin", [Validators.required]),
      cc: new FormControl(
        "",
        Validators.compose([
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      message: new FormControl("", [Validators.required]),
    });
  }

  getAllContactMessages() {
    this.Auth.getAllContactMessages(this.token.phone).subscribe(
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
    this.Messages = data.messages;
    this.dataSource = new MatTableDataSource(this.Messages);
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.Messages.length > 0) {
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
    this.getAllContactMessages();
    this.showDeleteAlert(data);
  }

  handleDeleteError(error) {
    this.deleteLoading = false;
  }

  updateAllComplete() {
    this.allComplete =
      this.Messages != null && this.Messages.every((t) => t.checked);
  }

  someComplete(): boolean {
    return (
      this.Messages.filter((t) => t.checked).length > 0 && !this.allComplete
    );
  }

  setAll(checked: boolean) {
    this.allComplete = checked;
    if (this.Messages == null) {
      return;
    }
    this.Messages.forEach((t) => (t.checked = checked));
  }

  openModal(message, modal, size, centered?) {
    this.selectedMessage = message;
    this.modal.open(this[modal], { centered: centered, size: size });
  }

  sendReplyMessage(Form) {
    this.replyLoading = true;
    let _message = this.replyToSend;
    _message.msgID = this.selectedMessage.id;
    _message.msgEmail = this.selectedMessage.email;
    _message.as = Form.as;
    _message.cc = Form.cc;
    _message.message = Form.message;
    let body = { body: _message };
    this.Auth.replyContactMessage(body).subscribe(
      (data) => this.handleReplyResponse(data),
      (err) => console.log(err)
    );
  }

  handleReplyResponse(res) {
    this.replyRes = res.data;
    setTimeout(() => {
      this.replyRes = null;
    }, 5000);
    this.replyLoading = false;
  }

  deleteMessage(message) {
    this.deleteLoading = true;
    this.Auth.deleteContactMessage(message.id).subscribe(
      (res) => this.handleDeleteResponse(res),
      (err) => this.handleDeleteError(err)
    );
  }

  showDeleteAlert(res) {
    this.deleteNotification.title = "Success";
    this.deleteNotification.body = res.data;
    this.modal.open(this.deleteModal, { centered: true, size: "md" });
  }
}

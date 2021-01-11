import { Component, OnInit } from '@angular/core';
import { BluetoothService } from './../../../services/general/bluetooth.service';

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.component.html',
  styleUrls: ['./bluetooth.component.css'],
})
export class BluetoothComponent implements OnInit {
  constructor(private bluetooth: BluetoothService) {}

  ngOnInit(): void {}

  BatLevel = 0;

  connectDevices() {
    this.bluetooth.getDevice();
    this.getBattery();
  }

  getBattery() {
    this.bluetooth.value().subscribe((val) => {
      console.log('vaue', val);
    });
  }

  conectBT() {
    this.connectDevices();
  }
}

import { NgModule } from '@angular/core';

import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatTableModule } from '@angular/material/table';
// import { MatSortModule } from '@angular/material/sort';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatSelectModule } from '@angular/material/select';
// import { MatDialogModule } from '@angular/material/dialog';
// import {MatButtonToggleModule} from '@angular/material/button-toggle';


@NgModule({
    exports: [
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    // MatMenuModule,
    // MatTabsModule,
    // MatTableModule,
    // MatSortModule,
    // MatChipsModule,
    // MatSelectModule,
    // MatDialogModule,
    // MatButtonToggleModule
    ]
})
export class MatModule { }

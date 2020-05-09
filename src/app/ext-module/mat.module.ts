import { NgModule } from '@angular/core';

import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
// import { MatIconModule } from '@angular/material/icon';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatButtonModule } from '@angular/material/button';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatTableModule } from '@angular/material/table';
// import {MatPaginatorModule} from '@angular/material/paginator';
// import { MatSortModule } from '@angular/material/sort';
// import { MatBadgeModule } from '@angular/material/badge';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatSelectModule } from '@angular/material/select';
// import { MatDialogModule } from '@angular/material/dialog';
// import {MatButtonToggleModule} from '@angular/material/button-toggle';


@NgModule({
    exports: [
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    // MatIconModule,
    // MatMenuModule,
    // MatButtonModule,
    // MatTabsModule,
    // MatTableModule,
    // MatPaginatorModule,
    // MatSortModule,
    // MatBadgeModule,
    // MatChipsModule,
    // MatSelectModule,
    // MatDialogModule,
    // MatButtonToggleModule
    ]
})
export class MatModule { }

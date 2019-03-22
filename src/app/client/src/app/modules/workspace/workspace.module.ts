import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { WorkSpaceService, EditorService, BatchService, ReviewCommentsService, TeachingPackService } from './services';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  WorkspaceComponent, CreateContentComponent, DraftComponent,
  ReviewSubmissionsComponent, PublishedComponent, UploadedComponent,
  CollectionEditorComponent, ContentEditorComponent, GenericEditorComponent,
  WorkspacesidebarComponent, DataDrivenComponent, DefaultTemplateComponent,
  FlaggedComponent, UpForReviewComponent, UpforReviewFilterComponent,
  BatchListComponent, BatchCardComponent, UpdateBatchComponent,
  UpforreviewContentplayerComponent, FlagConentplayerComponent, ReviewsubmissionsContentplayerComponent,
  PublishedPopupComponent, RequestChangesPopupComponent, LimitedPublishedComponent,
  AllContentComponent, FlagReviewerComponent, AllMyContentFilterComponent, CollaboratingOnComponent,
  CollaborationContentFilterComponent, TeachingPackComponent, PadagogyTopicSelectorComponent, CreateTeachingPackComponent,
  CreateTeachingMethodComponent, TeachingPackFilterComponent, ReviewTeachingPackComponent
} from './components';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
import { ReviewCommentsComponent } from './components/review-comments/review-comments.component';
import { OrderModule } from 'ngx-order-pipe';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TreeNgxModule } from 'tree-ngx';

@NgModule({
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    SharedModule,
    SuiModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule,
    NgInviewModule,
    TelemetryModule,
    OrderModule,
    CKEditorModule,
    TreeNgxModule,
    InfiniteScrollModule
  ],
  declarations: [WorkspaceComponent, WorkspacesidebarComponent,
    CreateContentComponent, DraftComponent, ReviewSubmissionsComponent,
    PublishedComponent, UploadedComponent, CollectionEditorComponent,
    ContentEditorComponent, GenericEditorComponent, UpForReviewComponent, UpforReviewFilterComponent,
    DataDrivenComponent, UpForReviewComponent, UpforReviewFilterComponent, DefaultTemplateComponent,
    FlaggedComponent, BatchListComponent, BatchCardComponent, UpdateBatchComponent, UpforreviewContentplayerComponent,
    FlagConentplayerComponent,
    ReviewsubmissionsContentplayerComponent,
    PublishedPopupComponent,
    RequestChangesPopupComponent,
    LimitedPublishedComponent,
    AllContentComponent,
    FlagReviewerComponent,
    AllMyContentFilterComponent,
    CollaboratingOnComponent,
    CollaborationContentFilterComponent,
    ReviewCommentsComponent,
    CollaborationContentFilterComponent,
    TeachingPackComponent,
    PadagogyTopicSelectorComponent,
    CreateTeachingPackComponent,
    CreateTeachingMethodComponent,
    TeachingPackFilterComponent,
    ReviewTeachingPackComponent
  ],
  providers: [WorkSpaceService, EditorService, BatchService, ReviewCommentsService, TeachingPackService]
})
export class WorkspaceModule { }

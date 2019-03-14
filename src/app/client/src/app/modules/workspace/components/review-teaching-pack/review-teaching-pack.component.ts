import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorService } from './../../services';
import { PublicDataService, UserService, PlayerService } from '@sunbird/core';
import { ConfigService, IUserProfile, IUserData, ToasterService, ContentData, PlayerConfig } from '@sunbird/shared';
import { TeachingPackService } from '../../services';
import * as _ from 'lodash';
// import { ConfigService } from 'src/app/modules/shared';
@Component({
  selector: 'app-review-teaching-pack',
  templateUrl: './review-teaching-pack.component.html',
  styleUrls: ['./review-teaching-pack.component.css']
})
export class ReviewTeachingPackComponent implements OnInit {

  public userProfile: IUserProfile;
  contentData: ContentData;
  playerConfig: PlayerConfig;
  public playerService: PlayerService;
  public stageId: string;
  public playerLoaded = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private editorService: EditorService,
    public publicDataService: PublicDataService,
    public configService: ConfigService,
    private userService: UserService,
    public teachingPackService: TeachingPackService,
    private toasterService: ToasterService,
    playerService: PlayerService
  ) {
    this.playerService = playerService;
  }
  padagogyFlow: any;
  contentId: string;
  collectionDetails: {};
  lessonName: string;
  lessonDescription: string;
  padagogySteps = [];
  topicName: string;
  showLoader = true;
  planChildrens = [];
  previewType = '';
  showCommentBoxClass = 'twelve wide column';
  
  showError = false;
  errorMessage: string;
  someFlag = false;
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.contentId = params['contentId'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.previewType = params['type'];
    });
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
    this.getCollectionDetails();
  }

  getCollectionDetails() {
    const options: any = { params: {} };
    // options.params.mode = 'edit';
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET_HIERARCHY}/${this.contentId}`,
      param: {
        mode: 'edit'
      }
    };
    this.teachingPackService.get(req).subscribe((res) => {
      this.showLoader = false;
      this.collectionDetails = res.result.content;
      this.lessonName = this.collectionDetails['name'];
      this.lessonDescription = this.collectionDetails['description'];
      this.topicName = this.collectionDetails['topics'];
      this.padagogySteps = JSON.parse(this.collectionDetails['pedagogySteps']);
      const children = _.filter(this.collectionDetails['children'], ['contentType', 'TeacherAidUnit']);
      _.forEach(this.padagogySteps, (item) => {
        _.forEach(children, (item2) => {
          if (item.name === item2.pedagogyStep) {
            item['info'] = item2;
            const request = {
              url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${item2.identifier}`,
              param: {
                mode: 'edit',
                fields: 'duration,methodtype,body,name,versionKey,description,board,gradeLevel,subject,medium,pedagogyStep'
              }
            };
            this.publicDataService.get(request).subscribe((response) => {
              if (response.responseCode === 'OK') {
                item['body'] = response.result['content']['body'];
                item['children'] = response.result['content']['children'];
              }
            });
          }
        });
      });
    });
  }

  goToReviewSubmissions() {
    if (this.previewType === 'creator') {
      this.router.navigate(['workspace/new/teachingpack', this.contentId]);
    } else if (this.previewType === 'reviewer') {
      this.router.navigate(['workspace/content/upForReview', 1]);
    } else {
      this.router.navigate(['workspace/content/review', 1]);
    }
  }

  publishContent() {
    this.showLoader = true;
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.PUBLISH_CONTENT}/${this.contentId}`,
      data: {
        'request': {
          content: {
            lastPublishedBy: this.userProfile.id
          }
        }
      }
    };
    this.publicDataService.post(req).subscribe((res) => {
      this.router.navigate(['workspace/content/upForReview', 1]);
    }, (err) => {
      this.showLoader = false;
      this.toasterService.error(err.error.params.errmsg);
    });
  }

  rejectContent() {
    this.showLoader = true;
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.REJECT_CONTENT}/${this.contentId}`,
      data: {
        'request': {
          // content: {
          //   lastPublishedBy: this.userProfile.id
          // }
        }
      }
    };
    this.publicDataService.post(req).subscribe((res) => {
      this.router.navigate(['workspace/content/upForReview', 1]);
    }, (err) => {
      this.showLoader = false;
      this.toasterService.error(err.error.params.errmsg);
    });
  }
  dismissImageUploadModal() {
    this.someFlag = false;
  }
  getContent(contentId) {
    this.showLoader = true;
    const option = {
      params: { mode: 'edit' }
    };
    this.playerService.getContent(contentId, option).subscribe(
      (response) => {
        if (response.result.content) {
          const contentDetails = {
            contentId: contentId,
            contentData: response.result.content
          };
          this.playerConfig = this.playerService.getConfig(contentDetails);
          this.playerConfig.data = this.playerService.updateContentBodyForReviewer(this.playerConfig.data);
          this.contentData = response.result.content;
          // this.setInteractEventData();
          this.showCommentBoxClass = this.contentData.mimeType ===
            'application/vnd.ekstep.ecml-archive' ? 'twelve wide column' : 'twelve wide column';
          this.showLoader = false;
          this.someFlag = true;
        } else {
          this.toasterService.warning('ssa');
          // this.close();
        }
      },
      (err) => {
        this.showError = true;
        this.errorMessage = 'dad';
      });
  }

  public contentProgressEvent(event) {
    if (_.get(event, 'detail.telemetryData.eid') === 'END') {
      this.stageId = undefined;
    }
  }
  public handleReviewCommentEvent(event) {
    // this.commentList = event;
  }
  public handleSceneChangeEvent(data) {
    if (this.stageId !== data.stageId) {
      this.stageId = data.stageId;
    }
    if (!this.playerLoaded) {
      this.playerLoaded = true;
    }
  }
}

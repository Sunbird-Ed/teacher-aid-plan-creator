import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorService } from './../../services';
import { ContentService, PublicDataService, UserService } from '@sunbird/core';
import { ConfigService, ServerResponse, IUserProfile, IUserData } from '@sunbird/shared';
import * as _ from 'lodash';
// import { ConfigService } from 'src/app/modules/shared';
@Component({
  selector: 'app-create-teaching-pack',
  templateUrl: './create-teaching-pack.component.html',
  styleUrls: ['./create-teaching-pack.component.css']
})
export class CreateTeachingPackComponent implements OnInit {

  public userProfile: IUserProfile;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private editorService: EditorService,
    public publicDataService: PublicDataService,
    public configService: ConfigService,
    private userService: UserService,
  ) { }
  padagogyFlow: any;
  contentId: string;
  collectionDetails: {};
  lessonName: string;
  lessonDescription: string;
  padagogySteps = [];
  topicName: string;
  showLoader = true;
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.contentId = params['contentId'];
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
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${this.contentId}`,
      param: {}
    };
    this.publicDataService.get(req).subscribe((res) => {
      this.showLoader = false;
      this.collectionDetails = res.result.content;
      this.lessonName = this.collectionDetails['name'];
      this.lessonDescription = this.collectionDetails['description'];
      this.topicName = this.collectionDetails['topics'];
      this.padagogySteps = JSON.parse(this.collectionDetails['pedagogySteps']);
    });
  }

  updatePlanMetaData(goToMethod, methodId) {
    this.showLoader = true;
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.UPDATE}/${this.contentId}`,
      data: {
        'request': {
          content: {
            name: this.lessonName,
            description: this.lessonDescription,
            pedagogySteps: this.padagogySteps,
            versionKey: this.collectionDetails['versionKey']
          }
        }
      }
    };
    this.publicDataService.patch(req).subscribe((res) => {
      setTimeout(() => {
        if (goToMethod) {
          this.router.navigate(['workspace/new/teachingpack/' + this.contentId + '/teachingmethod'],
            { queryParams: { methodId: methodId } });
        } else {
          this.router.navigate(['workspace/content/teachingpack', 1]);
        }
      }, 2000);
    });
  }

  addNewMethod(stepName, hasMethod) {
    if (hasMethod) {
      const methodId = _.find(this.padagogySteps, ['name', stepName]).methodId;
      this.router.navigate(['workspace/new/teachingpack/' + this.contentId + '/teachingmethod'],
        { queryParams: { methodId: methodId } });
    } else {
      const requestData = {
        content: this.generateData(stepName)
      };
      this.editorService.create(requestData).subscribe(res => {
        this.padagogySteps.map((item) => {
          if (item.name === stepName) {
            item['hasMethod'] = true;
            item['methodId'] = res.result.content_id;
          }
        });
        this.updatePlanMetaData(true, res.result.content_id);
        // this.router.navigate(['workspace/new/teachingpack/' + this.contentId + '/teachingmethod']);
      }, err => {
        // this.toasterService.error(this.resourceService.messages.fmsg.m0010);
      });
    }

    // this.router.navigate(['workspace/new/teachingpack/' + this.contentId + '/teachingmethod']);
  }

  goToPacks() {
    this.router.navigate(['workspace/content/teachingpack', 1]);
  }

  generateData(stepName) {
    const requestData = {};
    requestData['pedagogyStep'] = stepName;
    requestData['name'] = 'Untitled',
      requestData['createdBy'] = this.userProfile.id,
      requestData['organisation'] = this.userProfile.organisationNames,
      requestData['createdFor'] = this.userProfile.organisationIds,
      requestData['contentType'] = 'TeachingMethod',
      requestData['mimeType'] = this.configService.urlConFig.URLS.CONTENT_COLLECTION;
    if (!_.isEmpty(this.userProfile.lastName)) {
      requestData['creator'] = this.userProfile.firstName + ' ' + this.userProfile.lastName;
    } else {
      requestData['creator'] = this.userProfile.firstName;
    }
    return requestData;
  }
}

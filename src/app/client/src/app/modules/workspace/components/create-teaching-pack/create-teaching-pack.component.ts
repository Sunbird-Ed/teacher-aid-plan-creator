import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorService } from './../../services';
import { ContentService, PublicDataService, UserService } from '@sunbird/core';
import { ConfigService, ServerResponse, IUserProfile, IUserData } from '@sunbird/shared';
import { TeachingPackService } from '../../services';
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
    public teachingPackService: TeachingPackService
  ) { }
  padagogyFlow: any;
  contentId: string;
  collectionDetails: {};
  lessonName: string;
  lessonDescription: string;
  padagogySteps = [];
  topicName: string;
  showLoader = true;
  planChildrens = [];
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
      url: `${this.configService.urlConFig.URLS.CONTENT.GET_HIERARCHY}/${this.contentId}`,
      param: { mode: 'edit' }
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
          }
        });
      });
      _.forEach(children, (item2) => {
        this.planChildrens.push(item2.identifier);
      });
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

  addNewMethod(step) {
    if (!!step.info && !!step.info.identifier) {
      const methodId = step.info.identifier;
      this.router.navigate(['workspace/new/teachingpack/' + this.contentId + '/teachingmethod'],
        { queryParams: { methodId: methodId } });
    } else {
      const requestData = {
        content: this.generateData(step.name)
      };
      this.editorService.create(requestData).subscribe(res => {
        this.planChildrens.push(res.result.content_id);
        this.updateLessonPlanHierarchy(res.result.content_id);
      }, err => {
      });
    }
  }

  updateLessonPlanHierarchy(methodId) {
    const req = {
      url: `action/${this.configService.urlConFig.URLS.CONTENT.UPDATE_HIERARCHY}`,
      data: {
        'request': {
          data: {
            nodesModified: {},
            hierarchy: {
              [this.contentId]: {
                'contentType': 'LessonPlan',
                children: this.planChildrens,
                root: true
              }
            }
          }
        }
      }
    };
    this.teachingPackService.patch(req).subscribe((res) => {
      this.router.navigate(['workspace/new/teachingpack/' + this.contentId + '/teachingmethod'],
        { queryParams: { methodId: methodId } });
    });
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
      requestData['contentType'] = 'TeacherAidUnit',
      requestData['mimeType'] = this.configService.urlConFig.URLS.CONTENT_COLLECTION;
      requestData['board'] = this.collectionDetails['board'];
      requestData['gradeLevel'] = this.collectionDetails['gradeLevel'];
      requestData['subject'] = this.collectionDetails['subject'];
      requestData['medium'] = this.collectionDetails['medium'];
    if (!_.isEmpty(this.userProfile.lastName)) {
      requestData['creator'] = this.userProfile.firstName + ' ' + this.userProfile.lastName;
    } else {
      requestData['creator'] = this.userProfile.firstName;
    }
    return requestData;
  }
}

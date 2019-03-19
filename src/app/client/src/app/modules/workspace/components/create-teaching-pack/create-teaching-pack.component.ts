import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorService } from './../../services';
import { ContentService, PublicDataService, UserService } from '@sunbird/core';
import { ConfigService, ServerResponse, IUserProfile, IUserData, ToasterService } from '@sunbird/shared';
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
    public teachingPackService: TeachingPackService,
    private toasterService: ToasterService
  ) { }

  /**
   * identifier of the lesson plan
   */
  contentId: string;

  /**
   * details of the lesson plan
   */
  collectionDetails: {};

  /**
   * name of the lesson plan
   */
  lessonName: string;

  /**
   * description of the lesson plan
   */
  lessonDescription: string;

  /**
   * pedagogy steps of the pedagogy flow selected for the plan
   */
  padagogySteps = [];

  /**
   * topic name
   */
  topicName: string;

  /**
   * To show / hide loader
  */
  showLoader = true;

  /**
   * teaching methods of the teaching plan
   */
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

  /**
   * This method is used to get details of the lesson plan
   */
  getCollectionDetails() {
    const options: any = { params: {} };
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


  /**
   * Function to update lesson plan details
   * @param {boolean} goToMethod flag for navigation after save
   * @param {number} methodId id of the lesson plan
   * @param {fromReview} goToMethod flag for navigation after save
   */
  updatePlanMetaData(goToMethod, methodId, fromReview = false) {
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
      if (!fromReview) {
        setTimeout(() => {
          if (goToMethod) {
            this.router.navigate(['workspace/new/teachingpack/' + this.contentId + '/teachingmethod'],
              { queryParams: { methodId: methodId } });
          } else {
            this.router.navigate(['workspace/content/teachingpack', 1]);
          }
        }, 2000);
      }
    });
  }

  /**
   * Function to add/view teaching method of a plan
   * @param {object} step pedagogy step for which method is being added
   */
  addNewMethod(step) {
    this.updatePlanMetaData(false, this.contentId, true);
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

  /**
   * Function to update the hierarchy of the lesson plan
   * @param {number} methodId identifier of the plan
   */
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

  /**
  * Function to navigate to teaching pack list
  */
  goToPacks() {
    this.router.navigate(['workspace/content/teachingpack', 1]);
  }

  /**
  * Function to generate form data for teaching method
  * @param {string} stepName pedagogy step name for which method will be added
  */
  generateData(stepName) {
    const requestData = {};
    requestData['pedagogyStep'] = stepName;
    requestData['name'] = 'Untitled';
    requestData['createdBy'] = this.userProfile.id;
    requestData['organisation'] = this.userProfile.organisationNames;
    requestData['createdFor'] = this.userProfile.organisationIds;
    requestData['contentType'] = 'TeacherAidUnit';
    requestData['mimeType'] = this.configService.urlConFig.URLS.CONTENT_COLLECTION;
    requestData['board'] = this.collectionDetails['board'];
    requestData['gradeLevel'] = this.collectionDetails['gradeLevel'];
    requestData['subject'] = this.collectionDetails['subject'];
    requestData['medium'] = this.collectionDetails['medium'];
    requestData['topicName'] = this.topicName;
    if (!_.isEmpty(this.userProfile.lastName)) {
      requestData['creator'] = this.userProfile.firstName + ' ' + this.userProfile.lastName;
    } else {
      requestData['creator'] = this.userProfile.firstName;
    }
    return requestData;
  }

  /**
  * Function to submit the teaching pack for review
  */
  submitForReview() {
    this.showLoader = true;
    this.updatePlanMetaData(false, this.contentId, true);
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.SUBMIT_FOR_REVIEW}/${this.contentId}`,
      data: {
        'request': {
          // content: {
          //   name: this.lessonName,
          //   description: this.lessonDescription,
          //   versionKey: this.collectionDetails['versionKey']
          // }
        }
      }
    };
    this.publicDataService.post(req).subscribe((res) => {
      this.toasterService.success('Sent for review');
      setTimeout(() => {
        this.router.navigate(['workspace/content/teachingpack', 1]);
      }, 2000);
    });
  }

  /**
   * Function to go to preview lesson plan page
   */
  previewTeachingPack() {
    this.router.navigate(['workspace/new/teachingpack/' + this.contentId + '/preview'], { queryParams: { type: 'creator' } });
  }
}

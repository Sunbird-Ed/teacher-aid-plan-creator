
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FrameworkService } from '@sunbird/core';
import { ToasterService, ResourceService, Framework } from '@sunbird/shared';
import { PublicDataService, SearchService, FormService, UserService } from '@sunbird/core';
import { ConfigService, ServerResponse, IUserData, IUserProfile } from '@sunbird/shared';
import * as _ from 'lodash';
import { CacheService } from 'ng2-cache-service';
import { DefaultTemplateComponent } from '../content-creation-default-template/content-creation-default-template.component';
import { TreeMode } from 'tree-ngx';
import { EditorService } from './../../services';
@Component({
  selector: 'app-padagogy-topic-selector',
  templateUrl: './padagogy-topic-selector.component.html',
  styleUrls: ['./padagogy-topic-selector.component.css']
})
export class PadagogyTopicSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal;
  @ViewChild('formData') formData: DefaultTemplateComponent;
  public frameworkService: FrameworkService;
  public framework: string;
  private searchService: SearchService;
  private editorService: EditorService;
  public userProfile: IUserProfile;
  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;
  /**
  * To show toaster(error, success etc) after any API calls
  */
  /**
  * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;
  /**
  * To call resource service which helps to use language constant
  */

  /**
  * reference of config service.
  */
  public configService: ConfigService;

  public publicDataService: PublicDataService;
  public categoryMasterList: any;
  public formService: FormService;
  public isCachedDataExists: boolean;
  public contentType;
  public formType = 'content';

  public formAction = 'create';
  public getFormFields: any;


  public formFieldProperties: any;
  public frameworkData: object;
  public selectedTopic = [];

  constructor(
    activatedRoute: ActivatedRoute,
    private router: Router,
    frameworkService: FrameworkService,
    toasterService: ToasterService,
    resourceService: ResourceService,
    publicDataService: PublicDataService,
    searchService: SearchService,
    configService: ConfigService,
    formService: FormService,
    private _cacheService: CacheService,
    private userService: UserService,
    editorService: EditorService,
  ) {
    this.frameworkService = frameworkService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.publicDataService = publicDataService;
    this.configService = configService;
    this.searchService = searchService;
    this.formService = formService;
    this.contentType = 'teachingaid';
    this.editorService = editorService;
    this.userService = userService;
  }
  filterData: any;
  topics = [];
  padagogyList = [];
  pedagogyStepList = [];
  selectedFlow: any;
  showTopicSelector: boolean;
  showPadagogySelector: boolean;
  formContent: any;
  treeOptions = {
    mode: TreeMode.SingleSelect,
    checkboxes: false,
    alwaysEmitSelected: true
  };
  copyDeep = [];
  ngOnInit() {
    this.frameworkService.initialize();
    this.fetchFrameworkMetaData();
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
  }

  public selecedItemsChanged(item) {
    this.selectedTopic = item;
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }


  fetchFrameworkMetaData() {

    this.frameworkService.frameworkData$.subscribe((frameworkData: Framework) => {
      if (!frameworkData.err) {
        this.categoryMasterList = _.cloneDeep(frameworkData.frameworkdata['defaultFramework'].categories);
        this.framework = frameworkData.frameworkdata['defaultFramework'].code;
        /**
  * isCachedDataExists will check data is exists in cache or not. If exists should not call
  * form api otherwise call form api and get form data
  */
        this.isCachedDataExists = this._cacheService.exists(this.contentType + this.formAction);
        if (this.isCachedDataExists) {
          const data: any | null = this._cacheService.get(this.contentType + this.formAction);
          this.formFieldProperties = data;
        } else {
          const formServiceInputParams = {
            formType: this.formType,
            formAction: this.formAction,
            contentType: this.contentType,
            framework: this.framework
          };
          this.formService.getFormConfig(formServiceInputParams).subscribe(
            (data: ServerResponse) => {
              this.formFieldProperties = data;
              this.getFormConfig();
            },
            (err: ServerResponse) => {
              this.toasterService.error(this.resourceService.messages.emsg.m0005);
            }
          );
        }
        this.categoryMasterList.map((item) => {
          if (item.code === 'topic') {
            this.topics = item.terms;
          }
          if (item.code === 'pedagogyFlow') {
            this.padagogyList = item.terms;
          }
          if (item.code === 'pedagogyStep') {
            this.pedagogyStepList = item.terms;
          }
        });
      } else if (frameworkData && frameworkData.err) {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    });
  }

  getFormConfig() {
    _.forEach(this.categoryMasterList, (category) => {
      _.forEach(this.formFieldProperties, (formFieldCategory) => {
        if (category.code === formFieldCategory.code) {
          formFieldCategory.range = category.terms;
        }
        return formFieldCategory;
      });
    });
    this.formFieldProperties = _.sortBy(_.uniqBy(this.formFieldProperties, 'code'), 'index');
    this._cacheService.set(this.contentType + this.formAction, this.formFieldProperties,
      {
        maxAge: this.configService.appConfig.cacheServiceConfig.setTimeInMinutes *
          this.configService.appConfig.cacheServiceConfig.setTimeInSeconds
      });
  }

  goToTeachingPack() {
    this.router.navigate(['workspace/content/teachingpack', 1]);
  }

  // startCreating() {
  //   this.router.navigate(['workspace/new/teachingpack', 'do_12343324']);
  // }

  goToPedagogyScreen() {
    this.filterTopics();
    this.padagogyList.map((item) => {
      item['pedagogyStep'] = [];
      item.associations = _.intersectionBy(this.pedagogyStepList, item.associations, 'identifier');
      item.associations.map((step) => {
        if (step.category === 'pedagogyStep') {
          item['pedagogyStep'].push(step);
        }
      });
    });
    this.showPadagogySelector = true;
  }

  goToTopicScreen() {
    this.showPadagogySelector = false;
    this.showTopicSelector = true;
  }
  filterTopics() {
    const content = _.pickBy(this.formData.formInputData);
    this.formContent = _.pickBy(this.formData.formInputData);
    const temp = [];
    let boardTopics = [];
    let subjectTopics = [];
    let gradeTopics = [];
    let mediumTopics = [];
    this.categoryMasterList.map((item) => {
      if (item.code === 'board') {
        item.terms.map((item2) => {
          if (item2.name == content.board) {
            boardTopics = this.pickTopics(item2.associations);
          }
        });
      } else if (item.code === 'subject') {
        item.terms.map((item2) => {
          if (item2.name == content.subject) {
            subjectTopics = this.pickTopics(item2.associations);
          }
        });
      } else if (item.code === 'gradeLevel') {
        item.terms.map((item2) => {
          if (item2.name == content.gradeLevel) {
            gradeTopics = this.pickTopics(item2.associations);
          }
        });
      } else if (item.code === 'medium') {
        item.terms.map((item2) => {
          if (item2.name == content.medium) {
            mediumTopics = this.pickTopics(item2.associations);
          }
        });
      }
    });
    const finalarry = _.intersectionBy(this.topics, boardTopics, gradeTopics, subjectTopics, mediumTopics, 'identifier');
    this.topics = finalarry;
    this.topics.map((item) => {
      item.expanded = false;
      item.item = item.name;
      if (item.children && item.children.length) {
        item.children.map((child) => {
          child.expanded = false;
          child.item = child.name;
          if (child.children && child.children.length) {
            child.children.map((gchild) => {
              gchild.item = gchild.name;
            });
          }
        });
      }
    });

  }

  filterTopicListByUserSelction = (master, type) => {
    const content = _.pickBy(this.formData.formInputData);
    let arr = [];
    master.terms.map((item) => {
      if (item.name == content[type]) {
        arr = this.pickTopics(item.associations);
      }
    });
  }

  pickTopics = (master) => {
    const associatedTopics = [];
    master.map((item) => {
      if (item.category === 'topic') {
        associatedTopics.push(item);
      }
    });
    return associatedTopics;
  }

  createContent() {
    const requestData = {
      content: this.generateData(this.formContent)
    };
    this.editorService.create(requestData).subscribe(res => {
      this.router.navigate(['workspace/new/teachingpack', res.result.content_id]);
    }, err => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0010);
    });
  }

  generateData(data) {
    // this.showLoader = true;
    const requestData = _.cloneDeep(data);
    requestData['gradeLevel'] = [requestData['gradeLevel']];
    requestData['name'] = 'Untitled',
      requestData['description'] = '',
      requestData['createdBy'] = this.userProfile.id,
      requestData['organisation'] = this.userProfile.organisationNames,
      requestData['createdFor'] = this.userProfile.organisationIds,
      requestData['contentType'] = 'LessonPlan',
      requestData['framework'] = this.framework;
    requestData['mimeType'] = this.configService.urlConFig.URLS.CONTENT_COLLECTION;
    requestData['topics'] = this.selectedTopic[0];
    requestData['pedagogySteps'] = this.selectedFlow['pedagogyStep'];
    requestData['resourceType'] = 'Lesson Plan';
    if (!_.isEmpty(this.userProfile.lastName)) {
      requestData['creator'] = this.userProfile.firstName + ' ' + this.userProfile.lastName;
    } else {
      requestData['creator'] = this.userProfile.firstName;
    }
    return requestData;
  }
}


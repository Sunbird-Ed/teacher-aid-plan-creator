
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FrameworkService } from '@sunbird/core';
import { ToasterService, ResourceService, Framework } from '@sunbird/shared';
import { PublicDataService, FormService, UserService } from '@sunbird/core';
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
  /**
   * to call the framework services which gives framework related data
   */
  public frameworkService: FrameworkService;

  public framework: string;

  /**
   * to call editor service
   */
  private editorService: EditorService;

  /**
   * user profile info
   */
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

  /**
   * to call public data service
   */
  public publicDataService: PublicDataService;

  /**
   * master list of user framwork categories
   */
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
  seachTopicString = '';
  filteredTopics = [];
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

  /**
   * function to get user framework metadata
   */
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
          if (item.code === 'contentTemplate') {
            this.padagogyList = item.terms;
          }
          if (item.code === 'contentTemplateUnits') {
            this.pedagogyStepList = item.terms;
          }
        });
      } else if (frameworkData && frameworkData.err) {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    });
  }

  /**
   * function to get form fields for creating teaching pack
   */
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

  /**
   * function to navigate to teaching pack list
   */
  goToTeachingPack() {
    this.router.navigate(['workspace/content/teachingpack', 1]);
  }

  /**
   * function to show pedagoy flow selection screen
   */
  goToPedagogyScreen() {
    this.filterTopics();
    this.padagogyList.map((item) => {
      item['pedagogyStep'] = [];
      item.associations = _.intersectionBy(this.pedagogyStepList, item.associations, 'identifier');
      item.associations.map((step) => {
        if (step.category === 'contentTemplateUnits') {
          item['pedagogyStep'].push(step);
        }
      });
    });
    this.showPadagogySelector = true;
  }

  /**
   * function to show topic selection screen
   */
  goToTopicScreen() {
    this.showPadagogySelector = false;
    this.showTopicSelector = true;
  }

  /**
   * function to filter topics based upon board/grade/subject/medium
   */
  filterTopics() {
    const content = _.pickBy(this.formData.formInputData);
    this.formContent = _.pickBy(this.formData.formInputData);
    let boardTopics = [];
    let subjectTopics = [];
    let gradeTopics = [];
    let mediumTopics = [];
    this.categoryMasterList.map((item) => {
      if (item.code === 'board') {
        if (!!content.board) {
          item.terms.map((item2) => {
            if (item2.name === content.board) {
              if (!!item2.associations && !!item2.associations.length) {
                boardTopics = this.pickTopics(item2.associations);
              } else {
                boardTopics = this.pickTopics(item2.associations);
              }
            }
          });
        } else {
          boardTopics = [...this.topics];
        }
      } else if (item.code === 'subject') {
        if (!!content.subject) {
          item.terms.map((item2) => {
            if (item2.name === content.subject) {
              if (!!item2.associations && !!item2.associations.length) {
                subjectTopics = this.pickTopics(item2.associations);
              } else {
                subjectTopics = [...this.topics];
              }
            }
          });
        } else {
          subjectTopics = [...this.topics];
        }
      } else if (item.code === 'gradeLevel') {
        if (!!content.gradeLevel) {
          item.terms.map((item2) => {
            if (item2.name === content.gradeLevel) {
              if (!!item2.associations && !!item2.associations.length) {
                gradeTopics = this.pickTopics(item2.associations);
              } else {
                gradeTopics = [...this.topics];
              }
            }
          });
        } else {
          gradeTopics = [...this.topics];
        }
      } else if (item.code === 'medium') {
        if (!!content.medium) {
          item.terms.map((item2) => {
            if (item2.name === content.medium) {
              if (!!item2.associations && !!item2.associations.length) {
                mediumTopics = this.pickTopics(item2.associations);
              } else {
                mediumTopics = [...this.topics];
              }
            }
          });
        } else {
          mediumTopics = [...this.topics];
        }
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

  /**
   * function to create teaching pack
   */
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

  /**
   * function to generete form data for a teaching pack
   * @param data form data filled/selected by user
   */
  generateData(data) {
    const requestData = _.cloneDeep(data);
    requestData['gradeLevel'] = [requestData['gradeLevel']];
    requestData['name'] = 'Untitled',
      requestData['description'] = '',
      requestData['createdBy'] = this.userProfile.id,
      requestData['organisation'] = this.userProfile.organisationNames,
      requestData['createdFor'] = this.userProfile.organisationIds,
      requestData['contentType'] = 'TeacherAid',
      requestData['framework'] = this.framework;
    requestData['mimeType'] = this.configService.urlConFig.URLS.CONTENT_COLLECTION;
    requestData['topics'] = this.selectedTopic[0];
    requestData['pedagogySteps'] = this.selectedFlow['pedagogyStep'];
    // requestData['resourceType'] = 'Lesson Plan';
    if (!_.isEmpty(this.userProfile.lastName)) {
      requestData['creator'] = this.userProfile.firstName + ' ' + this.userProfile.lastName;
    } else {
      requestData['creator'] = this.userProfile.firstName;
    }
    return requestData;
  }


  /**
   * functio to search topic
   * @param {string} keyword search keyword
  */
  searchTopic = (keyword) => {
    this.seachTopicString = keyword.target.value;
    const result = [];
    if (this.seachTopicString.length) {
      for (let i = 0; i < this.topics.length; i++) {
        if (this.topics[i]['name'].search(new RegExp(this.seachTopicString, 'i')) < 0) {

        } else {

          const topic = this.topics[i];
          topic.expanded = true;
          result.push(topic);
        }
        if (!!this.topics[i].children && this.topics[i].children.length) {
          for (let j = 0; j < this.topics[i].children.length; j++) {
            if (this.topics[i].children[j]['name'].search(new RegExp(this.seachTopicString, 'i')) < 0) {
            } else {
              const topic = this.topics[i].children[j];
              topic.expanded = true;
              result.push(topic);
            }
            if (!!this.topics[i].children[j].children && this.topics[i].children[j].children.length) {
              for (let k = 0; k < this.topics[i].children[j].children; k++) {
                if (this.topics[i].children[j].children[k]['name'].search(new RegExp(this.seachTopicString, 'i')) < 0) {

                } else {
                  const topic = this.topics[i].children[j].children[k]
                  topic.expanded = true;
                  result.push(topic);
                }
              }
            }
          }
        }
      }
      this.filteredTopics = _.uniqBy(result, 'identifier');
    } else {
      this.filteredTopics.length = 0;
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
  }
}



import { Component, OnInit, ViewChild, OnDestroy, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FrameworkService } from '@sunbird/core';
import { ToasterService, ResourceService, Framework } from '@sunbird/shared';
import { PublicDataService, SearchService, FormService, UserService } from '@sunbird/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import * as _ from 'lodash';
import { CacheService } from 'ng2-cache-service';
@Component({
  selector: 'app-padagogy-topic-selector',
  templateUrl: './padagogy-topic-selector.component.html',
  styleUrls: ['./padagogy-topic-selector.component.css']
})
export class PadagogyTopicSelectorComponent implements OnInit, OnDestroy, AfterContentInit {
  @ViewChild('modal') modal;
  public frameworkService: FrameworkService;
  public framework: string;
  private searchService: SearchService;
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
    private userService: UserService
  ) {
    this.frameworkService = frameworkService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.publicDataService = publicDataService;
    this.configService = configService;
    this.searchService = searchService;
    this.formService = formService;
    this.contentType = 'teachingaid';
  }
  filterData: any;
  topics = [];
  padagogyList = [];
  selectedTopic = [];
  selectedFlow: any;
  showSelctionScreen: boolean;
  showTopicSelector: boolean;
  ngOnInit() {
    this.frameworkService.initialize();
    this.fetchFrameworkMetaData();
  }
  ngAfterContentInit() {
    // this.fetchFrameworkMetaData();
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }
  /**
  * fetchFrameworkMetaData is gives form config data
  */
  // fetchFrameworkMetaData() {
  //   this.frameworkService.frameworkData$.subscribe((frameworkData: Framework) => {
  //     if (!frameworkData.err) {
  //       this.categoryMasterList = _.cloneDeep(frameworkData.frameworkdata['defaultFramework'].categories);
  //       this.framework = frameworkData.frameworkdata['defaultFramework'].code;
  //       console.log('framework is', this.categoryMasterList);
  //       this.categoryMasterList.map((item) => {
  //         if (item.code === 'topic') {
  //           this.topics = item.terms;
  //         }
  //       });
  //       console.log('topics', this.topics);
  //     } else if (frameworkData && frameworkData.err) {
  //       this.toasterService.error(this.resourceService.messages.emsg.m0005);
  //     }
  //   });
  // }

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
        });
      } else if (frameworkData && frameworkData.err) {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    });
    console.log('category master ', this.categoryMasterList);
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
  selectTopic(item) {
    if (this.selectedTopic.indexOf(item) === -1) {
      item['selected'] = true;
      this.selectedTopic.push(item);
    } else {
      for (let i = 0; i < this.selectedTopic.length; i++) {
        if (item.index === this.selectedTopic[i].index) {
          this.selectedTopic.splice(this.selectedTopic[i], 1);
          item['selected'] = false;
        }
      }
    }
  }

  goToTeachingPack() {
    this.router.navigate(['workspace/content/teachingpack', 1]);
  }

  startCreating() {
    this.router.navigate(['workspace/new/teachingpack' , 'do_12343324']);
  }
  createContent() {
    this.showTopicSelector = true;
  }
}



import { Component, OnInit, ViewChild, OnDestroy, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FrameworkService } from '@sunbird/core';
import { ToasterService, ResourceService, Framework } from '@sunbird/shared';
import { PublicDataService, SearchService } from '@sunbird/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import * as _ from 'lodash';

@Component({
  selector: 'app-padagogy-topic-selector',
  templateUrl: './padagogy-topic-selector.component.html',
  styleUrls: ['./padagogy-topic-selector.component.css']
})
export class PadagogyTopicSelectorComponent implements OnInit, OnDestroy {
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
  public config: ConfigService;

  public publicDataService: PublicDataService;
  public categoryMasterList: any;
  constructor(
    activatedRoute: ActivatedRoute,
    private router: Router,
    frameworkService: FrameworkService,
    toasterService: ToasterService,
    resourceService: ResourceService,
    publicDataService: PublicDataService,
    searchService: SearchService,
    config: ConfigService
  ) {
    this.frameworkService = frameworkService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.publicDataService = publicDataService;
    this.config = config;
    this.searchService = searchService;
  }
  filterData: any;
  topics = [];
  padagogyList = [];
  selectedTopic = [];
  selectedFlow: any;
  showSelctionScreen: boolean;
  ngOnInit() {
    this.fetchFrameworkMetaData();
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }
  /**
  * fetchFrameworkMetaData is gives form config data
  */
  fetchFrameworkMetaData() {
    this.frameworkService.frameworkData$.subscribe((frameworkData: Framework) => {
      if (frameworkData && !frameworkData.err) {
        this.categoryMasterList = _.cloneDeep(frameworkData.frameworkdata['defaultFramework'].categories);
        this.framework = frameworkData.frameworkdata['defaultFramework'].code;
        console.log('framework is', this.categoryMasterList);
        this.categoryMasterList.map((item) => {
          if (item.code === 'topic') {
            this.topics = item.terms;
          }
        });
        console.log('topics', this.topics);
      } else if (frameworkData && frameworkData.err) {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
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
}


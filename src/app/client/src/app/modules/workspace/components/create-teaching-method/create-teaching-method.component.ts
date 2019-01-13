import { Component, OnInit, ViewChild } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ResourceService, IUserData, IUserProfile, ToasterService } from '@sunbird/shared';
import { PublicDataService, UserService, SearchService } from '@sunbird/core';
import { EditorService } from './../../services';
import { TeachingPackService } from '../../services';
import { MyUploadAdapter } from './file-uploader';

import * as _ from 'lodash';
import { from } from 'rxjs';
@Component({
  selector: 'app-create-teaching-method',
  templateUrl: './create-teaching-method.component.html',
  styleUrls: ['./create-teaching-method.component.css']
})
export class CreateTeachingMethodComponent implements OnInit {
  @ViewChild('modal') modal;
  public Editor: ClassicEditor = ClassicEditor;
  public userProfile: IUserProfile;
  public framework: string;
  private editorService: EditorService;
  private toasterService: ToasterService;
  public resourceService: ResourceService;
  public model = {
    editorData: ''
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private configService: ConfigService,
    editorService: EditorService,
    toasterService: ToasterService,
    resourceService: ResourceService,
    public publicDataService: PublicDataService,
    private teachingPackService: TeachingPackService,
    private searchService: SearchService

  ) {
    this.userService = userService;
    // this.configService = configService;
    this.editorService = editorService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
  }
  pageNo = 1;
  myAssets = [];
  editorData: any;
  contentId: string;
  methodId: string;
  collectionDetails = {};
  associatedResources = [];
  methodDetails = {
    selectedMethod: '',
    methodDuration: '',
    methodDescription: ''
  };
  teachingMethodList = [
    {
      'id': 1,
      'name': 'Group discussion'
    },
    {
      'id': 2,
      'name': 'Large group discussion'
    },
    {
      'id': 3,
      'name': 'Peer review/evaluation'
    },
    {
      'id': 4,
      'name': 'Quiz'
    },
    {
      'id': 5,
      'name': 'Brainstorming'
    },
    {
      'id': 6,
      'name': 'Model making'
    },
    {
      'id': 7,
      'name': 'Poster making'
    },
    {
      'id': 8,
      'name': 'Concept recall/recap'
    },
    {
      'id': 9,
      'name': 'Inference through observation'
    },
    {
      'id': 10,
      'name': 'Remediation'
    },
    {
      'id': 11,
      'name': 'Think-pair-share'
    },
    {
      'id': 12,
      'name': 'Group activity'
    },
    {
      'id': 13,
      'name': 'Individual exercise/Independent activity'
    },
    {
      'id': 14,
      'name': 'Questioning'
    },
    {
      'id': 15,
      'name': 'Choral response'
    },
    {
      'id': 16,
      'name': 'Whole-class sharing'
    },
    {
      'id': 17,
      'name': 'Directed reading questioning'
    },
    {
      'id': 18,
      'name': 'Reading for Meaning'
    },
    {
      'id': 19,
      'name': 'Problem-solving'
    },
    {
      'id': 20,
      'name': 'Pair exercise'
    },
    {
      'id': 21,
      'name': 'Group exercise'
    },
    {
      'id': 22,
      'name': 'Presentation'
    },
    {
      'id': 23,
      'name': 'Demonstration'
    },
    {
      'id': 24,
      'name': 'Animation demonstration'
    },
    {
      'id': 25,
      'name': 'Grade-as-you-go'
    },
    {
      'id': 26,
      'name': 'Selective highlighting'
    },
    {
      'id': 27,
      'name': 'Reading guide'
    },
    {
      'id': 28,
      'name': 'Experimentation'
    },
    {
      'id': 29,
      'name': 'K-W-L chart'
    },
    {
      'id': 30,
      'name': 'Raising hands/show of hands'
    },
    {
      'id': 31,
      'name': 'Learning log'
    },
    {
      'id': 32,
      'name': 'Writing Summary'
    },
    {
      'id': 33,
      'name': 'Comparing and contrasting'
    },
    {
      'id': 34,
      'name': 'Structured note-taking'
    },
    {
      'id': 35,
      'name': 'Diagram/Drawing '
    },
    {
      'id': 36,
      'name': 'T-chart'
    },
    {
      'id': 37,
      'name': 'Directed Reading Thinking Activity'
    },
    {
      'id': 38,
      'name': 'Survey-question-read-recite-review'
    },
    {
      'id': 39,
      'name': 'Pair activity'
    },
    {
      'id': 40,
      'name': 'Flow chart'
    },
    {
      'id': 41,
      'name': 'Graphic organiser'
    },
    {
      'id': 42,
      'name': 'Teach your Friends'
    },
    {
      'id': 43,
      'name': 'Pass-the-chalk'
    },
    {
      'id': 44,
      'name': 'Inference through observation'
    },
    {
      'id': 45,
      'name': 'Fist of five'
    },
    {
      'id': 46,
      'name': 'Labelling'
    },
    {
      'id': 47,
      'name': 'Word search'
    },
    {
      'id': 48,
      'name': 'Sorting'
    },
    {
      'id': 49,
      'name': 'Explanation'
    },
    {
      'id': 50,
      'name': 'Experiential learning'
    },
    {
      'id': 51,
      'name': 'Concept attainment'
    },
    {
      'id': 52,
      'name': 'Reflective discussion'
    },
    {
      'id': 53,
      'name': 'Collaboration'
    },
    {
      'id': 54,
      'name': 'Direct questioning'
    },
    {
      'id': 55,
      'name': 'Draw and discuss'
    },
    {
      'id': 56,
      'name': 'Vocabulary building '
    },
    {
      'id': 57,
      'name': 'Two/three/five sentence summary'
    },
    {
      'id': 58,
      'name': 'Collage making'
    },
    {
      'id': 59,
      'name': 'Jigsaw'
    },
    {
      'id': 60,
      'name': 'Project assignment'
    },
    {
      'id': 61,
      'name': 'Essay writing'
    },
    {
      'id': 62,
      'name': 'Sufi song'
    },
    {
      'id': 63,
      'name': 'Picture-based inference'
    },
    {
      'id': 64,
      'name': 'Map-based inference'
    },
    {
      'id': 65,
      'name': 'Travel brochures'
    },
    {
      'id': 66,
      'name': 'Map work'
    },
    {
      'id': 67,
      'name': 'Word web'
    },
    {
      'id': 68,
      'name': 'Inside-outside circle'
    },
    {
      'id': 69,
      'name': 'Popcorn reading'
    },
    {
      'id': 70,
      'name': 'Round-robin'
    },
    {
      'id': 71,
      'name': 'Role play'
    },
    {
      'id': 72,
      'name': 'Debate'
    },
    {
      'id': 73,
      'name': 'Numbered heads'
    },
    {
      'id': 74,
      'name': 'Venn diagram'
    },
    {
      'id': 75,
      'name': 'Model-based inference'
    },
    {
      'id': 76,
      'name': 'Slogan writing'
    },
    {
      'id': 77,
      'name': 'Speech'
    },
    {
      'id': 78,
      'name': 'Story'
    },
    {
      'id': 121,
      'name': 'Free choice play'
    },
    {
      'id': 122,
      'name': 'Circle time'
    },
    {
      'id': 123,
      'name': 'Wrapping up'
    }
  ];
  editorinstance: any;
  public config = {
    toolbar: {
      viewportTopOffset: 30
    }
  };
  showResoursePicker: boolean;
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.contentId = params['contentId'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.methodId = params['methodId'];
    });
    this.getMethodDetails();
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
    this.create();
  }

  createContent() {
    this.updatePlanMetaData();
  }

  goToPacks() {
    this.router.navigate(['workspace/content/teachingpack', 1]);
  }

  getMethodDetails() {
    const options: any = { params: {} };
    // options.params.mode = 'edit';
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${this.methodId}`,
      param: { mode: 'edit', fields: 'duration,methodtype,body,name,versionKey,description,board,gradeLevel,subject,medium' }
    };
    const req2 = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET_HIERARCHY}/${this.methodId}`,
      param: { mode: 'edit', fields: 'duration,methodtype,body,name,versionKey,description,children' }
    };
    this.teachingPackService.get(req2).subscribe((res) => {
      _.map(res.result.content.children, (item) => {
        this.associatedResources.push(item);
      });
    });
    this.publicDataService.get(req).subscribe((res) => {
      this.collectionDetails = res.result.content;
      this.methodDetails.methodDuration = this.collectionDetails['duration'];
      this.methodDetails.methodDescription = this.collectionDetails['description'];
      this.methodDetails.selectedMethod = this.collectionDetails['methodtype'];
      this.model.editorData = !!this.collectionDetails['body'] ? this.collectionDetails['body'] : '';
      this.editorinstance.setData(this.collectionDetails['body']);
    });
  }

  updatePlanMetaData() {
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.UPDATE}/${this.methodId}`,
      data: {
        'request': {
          content: {
            duration: this.methodDetails.methodDuration.toString(),
            description: this.methodDetails.methodDescription,
            body: this.editorinstance.getData(),
            methodtype: this.methodDetails.selectedMethod,
            versionKey: this.collectionDetails['versionKey']
          }
        }
      }
    };
    this.publicDataService.patch(req).subscribe((res) => {
      setTimeout(() => {
        this.router.navigate(['workspace/new/teachingpack', this.contentId]);
      }, 2000);
    });
  }

  create() {
    this.Editor.create(document.querySelector('#editor'), {
      extraPlugins: [this.MyCustomUploadAdapterPlugin]
    }).then((editorinstance) => {
      this.editorinstance = editorinstance;
    });
  }

  MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      // Configure the URL to the upload script in your back-end here!
      // return new MyUploadAdapter(loader, configService, teachingPackService);
    };
  }

  initializeImagePicker() {
    this.showResoursePicker = true;
    const req = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCHV3}`,
      data: {
        'request': {
          filters: {
            mediaType: ['image'],
            contentType: 'Asset',
            compatibilityLevel: {
              min: 1, max: 2
            },
            status: ['Live', 'Review', 'Draft'],
            createdBy: '3dcabadc-58e5-4b78-adb7-0013e5b5306b'
          },
          limit: 50,
          offset: 0
        }
      }
    };
    this.teachingPackService.post(req).subscribe((res) => {
      this.myAssets = res.result.content;
    });
  }

  dismissImagePicker() {
    this.showResoursePicker = false;
  }

  initializeResoursePicker() {
    this.showResoursePicker = true;
    if (this.pageNo === 1) {
      this.getResources();
    }
  }

  getResources() {
    const req = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCHV3}`,
      data: {
        'request': {
          filters: {
            contentType: ['Resource'],
            objectType: ['Content'],
            status: ['Live'],
            board: this.collectionDetails['board'],
            gradeLevel: this.collectionDetails['gradeLevel'],
            subject: this.collectionDetails['subject'],
            medium: this.collectionDetails['medium']
          },
          limit: 50,
          offset: this.pageNo - 1
        }
      }
    };

    this.teachingPackService.post(req).subscribe((res) => {
      _.map(res.result.content, (item) => {
        const recource = _.find(this.associatedResources, ['identifier', item.identifier]);
        if (recource !== undefined) {
          item['selected'] = true;
        }
        this.myAssets.push(item);
      });
    });
  }
  dismissResoursePicker() {
    this.showResoursePicker = false;
  }

  selectResourse(item) {
    item['selected'] = !item['selected'];
    const recource = _.find(this.associatedResources, ['identifier', item.identifier]);
    if (recource === undefined) {
      this.associatedResources.push(item);
    } else {
      const arr = _.remove(this.associatedResources, (res) => {
        return res.identifier !== item.identifier;
      });
      this.associatedResources = [...arr];
    }
  }

  removeResource(item) {
    const arr = _.remove(this.associatedResources, (res) => {
      return res.identifier !== item.identifier;
    });
    this.associatedResources = [...arr];
    this.addResources();
  }
  addResources() {
    const children = [];
    _.map(this.associatedResources, (item) => {
      children.push(item.identifier);
    });
    const req = {
      url: `action/${this.configService.urlConFig.URLS.CONTENT.UPDATE_HIERARCHY}`,
      data: {
        'request': {
          data: {
            nodesModified: {},
            hierarchy: {
              [this.methodId]: {
                'contentType': 'TeachingMethod',
                children: children,
                root: true
              }
            }
          }
        }
      }
    };
    this.teachingPackService.patch(req).subscribe((res) => {
    });
  }

  lazyloadResources() {
    if (this.myAssets.length / 50 >= 1) {
      this.pageNo = Math.ceil(this.myAssets.length / 50) + 1;
      this.getResources();
    }
  }
}

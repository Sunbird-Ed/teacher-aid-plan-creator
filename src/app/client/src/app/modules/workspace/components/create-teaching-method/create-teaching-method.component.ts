import { Component, OnInit, ViewChild } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ResourceService, IUserData, IUserProfile, ToasterService } from '@sunbird/shared';
import { PublicDataService, UserService, SearchService } from '@sunbird/core';
import { TeachingPackService } from '../../services';
// import { UploadAdapter } from './ckeditor-image-uploader';
import * as _ from 'lodash';
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
    toasterService: ToasterService,
    resourceService: ResourceService,
    public publicDataService: PublicDataService,
    private teachingPackService: TeachingPackService,
    private searchService: SearchService

  ) {
    this.userService = userService;
    // this.configService = configService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
  }
  pageNo = 1;
  myAssets = [];
  myResources = [];
  allImages = [];
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
  showResourcePicker: boolean;
  showImagePicker: boolean;
  showImageUploadModal: boolean;
  showErrorMsg: boolean;
  errorMsg: string;
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.contentId = params['contentId'];
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.methodId = params['methodId'];
    });
    this.teachingMethodList = _.orderBy(this.teachingMethodList, ['name'], ['asc']);
    this.getMethodDetails();
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
    this.create();
  }

  goToPacks() {
    this.router.navigate(['workspace/new/teachingpack', this.contentId]);
  }

  getMethodDetails() {
    const options: any = { params: {} };
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${this.methodId}`,
      param: { mode: 'edit', fields: 'duration,methodtype,body,name,versionKey,description,board,gradeLevel,subject,medium,pedagogyStep' }
    };
    const req2 = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET_HIERARCHY}/${this.methodId}`,
      param: { mode: 'edit' }
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
      // this.model.editorData = !!this.collectionDetails['body'] ? this.collectionDetails['body'] : '';
      const editorData = !!this.collectionDetails['body'] ? this.collectionDetails['body'] : '';
      this.editorinstance.setData(editorData);
    });
  }

  updateMethodData() {
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.UPDATE}/${this.methodId}`,
      data: {
        'request': {
          content: {
            duration: !!this.methodDetails.methodDuration ? this.methodDetails.methodDuration.toString() : '0',
            description: this.methodDetails.methodDescription,
            body: this.editorinstance.getData(),
            methodtype: this.methodDetails.selectedMethod,
            versionKey: this.collectionDetails['versionKey']
          }
        }
      }
    };
    this.publicDataService.patch(req).subscribe((res) => {
      this.updateLessonPlan();
    });
  }

  create() {
    this.Editor.create(document.querySelector('#editor'), {
      toolbar: ['heading', '|', 'bold', '|', 'italic', '|',
        'bulletedList', '|', 'numberedList', '|', 'insertTable', '|'],
      image: {
        toolbar: ['imageTextAlternative', '|', 'imageStyle:full', 'imageStyle:alignRight'],
        styles: ['full', 'alignLeft', 'alignRight', 'side', 'alignCenter']
      },
      removePlugins: ['ImageCaption'],
    }).then((editorinstance) => {
      this.editorinstance = editorinstance;
      // editorinstance.plugins.get('FileRepository').createUploadAdapter = loader => {
      //   return new UploadAdapter(this.configService, this.teachingPackService, this.userProfile, loader);
      // };
    });
  }


  getMyImages(offset) {
    if (offset === 0) {
      this.myAssets.length = 0;
    }
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
            status: ['Live'],
            createdBy: this.userProfile.userId
          },
          limit: 50,
          offset: offset
        }
      }
    };
    this.teachingPackService.post(req).subscribe((res) => {
      _.map(res.result.content, (item) => {
        this.myAssets.push(item);
      });
    });
  }

  initializeResourcePicker() {
    this.showResourcePicker = true;
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
        this.myResources.push(item);
      });
    });
  }
  dismissResourcePicker() {
    this.showResourcePicker = false;
  }

  dismissImagePicker() {
    this.showImagePicker = false;
  }

  dismissImageUploadModal() {
    this.showImagePicker = true;
    this.showImageUploadModal = false;
  }
  initiateImageUploadModal() {
    this.showImagePicker = false;
    this.showImageUploadModal = true;
  }
  selectResource(item) {
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
    if (this.myResources.length / 50 >= 1) {
      this.pageNo = Math.ceil(this.myResources.length / 50) + 1;
      this.getResources();
    }
  }

  updateLessonPlan() {
    const req2 = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET_HIERARCHY}/${this.contentId}`,
      param: { mode: 'edit' }
    };
    this.teachingPackService.get(req2).subscribe((res) => {
      const pedagogySteps = JSON.parse(res.result.content['pedagogySteps']);
      const versionKey = res.result.content.versionKey;
      _.map(pedagogySteps, (item) => {
        if (item.name === this.collectionDetails['pedagogyStep']) {
          item['duration'] = this.methodDetails.methodDuration.toString();
          item['MethodType'] = this.methodDetails.selectedMethod;
        }
      });
      const req = {
        url: `${this.configService.urlConFig.URLS.CONTENT.UPDATE}/${this.contentId}`,
        data: {
          'request': {
            content: {
              pedagogySteps: pedagogySteps,
              versionKey: versionKey
            }
          }
        }
      };
      this.publicDataService.patch(req).subscribe((response) => {
        setTimeout(() => {
          this.router.navigate(['workspace/new/teachingpack', this.contentId]);
        }, 2000);
      });
    });
  }

  initializeImagePicker() {
    this.showImagePicker = true;
  }

  addImageInEditor(imageUrl) {
    this.editorinstance.model.change(writer => {
      const imageElement = writer.createElement('image', {
        src: imageUrl
      });
      this.editorinstance.model.insertContent(imageElement, this.editorinstance.model.document.selection);
    });
    this.showImagePicker = false;
  }

  getAllImages(offset) {
    if (offset === 0) {
      this.allImages.length = 0;
    }
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
            status: ['Live']
          },
          limit: 50,
          offset: offset
        }
      }
    };
    this.teachingPackService.post(req).subscribe((res) => {
      _.map(res.result.content, (item) => {
        this.allImages.push(item);
      });
    });
  }
  lazyloadMyImages() {
    const offset = this.myAssets.length;
    this.getMyImages(offset);
  }

  lazyloadAllImages() {
    const offset = this.allImages.length;
    this.getAllImages(offset);
  }
  uploadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const formData: FormData = new FormData();
    formData.append('file', file);
    const fileType = file.type;
    const fileName = file.name;
    const fileSize = file.size / 1024 / 1024;
    if (fileType.split('/')[0] === 'image') {
      this.showErrorMsg = false;
      if (fileSize > 1) {
        this.showErrorMsg = true;
        this.errorMsg = 'Max size allowed is 1MB';
      } else {
        this.errorMsg = '';
        this.showErrorMsg = false;
        reader.readAsDataURL(file);
      }
    } else {
      this.showErrorMsg = true;
      this.errorMsg = 'Please choose an image file';
    }
    if (!this.showErrorMsg) {
      // reader.onload = (uploadEvent: any) => {
      const req = {
        url: this.configService.urlConFig.URLS.CONTENT.CREATE_CONTENT,
        data: {
          'request': {
            content: {
              name: fileName,
              contentType: 'Asset',
              mediaType: 'image',
              mimeType: fileType,
              createdBy: this.userProfile.userId,
              language: ['English'],
              creator: `${this.userProfile.firstName} ${this.userProfile.lastName ? this.userProfile.lastName : ''}`,
              code: 'org.ekstep0.5375271337424472',
            }
          }
        }
      };
      this.teachingPackService.post(req).subscribe((res) => {
        const imgId = res['result'].node_id;
        const request = {
          url: `${this.configService.urlConFig.URLS.CONTENT.UPLOAD_IMAGE}/${imgId}`,
          data: formData
        };
        this.teachingPackService.post(request).subscribe((response) => {
          this.addImageInEditor(response.result.content_url);
          this.showImagePicker = false;
          this.showImageUploadModal = false;
        });
      });
      reader.onerror = (error: any) => {
      };
    }
  }
}

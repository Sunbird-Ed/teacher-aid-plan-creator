import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-create-teaching-method',
  templateUrl: './create-teaching-method.component.html',
  styleUrls: ['./create-teaching-method.component.css']
})
export class CreateTeachingMethodComponent implements OnInit {

  public Editor = ClassicEditor;
  constructor(

  ) { }
  topicList = [];
  public config = {
    toolbar: {
      // items: ['bold', 'italic', '|', 'undo', 'redo'],

      viewportTopOffset: 30
    }
  };
  padagogyFlow: any;
  showStepSelection: boolean;
  cardData = {
    name: 'Lesson 1',
    image: 'assets/images/default.png',
    imageVisibility: false,
    description: 'this is the card description',
    maxCount: 4,
    progress: 40,
    rating: 4,
    right: {
      class: 'ui black right ribbon label',
      name: 'Plan'
    },
    metaData: {
      contentType: 'Resource',
      framework: 'rj_k-12_1',
      identifier: 'do_21265490361091686412478',
      mimeType: 'application/vnd.ekstep.ecml-archive',
      pkgVersion: 1
    },
    action: {
      onImage: { eventName: "onImage" },
      right: {
        class: "trash large icon",
        displayType: "icon",
        eventName: "delete"
      }
    },
    telemetryInteractEdata: {
      id: "published",
      pageid: "published",
      type: "click"
    }
  };
  ngOnInit() {
    
    //this.padagogyFlow = this.teachingAidDataService.getPadagogyFlow();
    this.padagogyFlow = {
      "ownershipType": ["createdBy"],
      "code": "org.sunbird.x9u5AH",
      "keywords": ["pedagogyflow", "delhi"],
      "subject": "Mathematics",
      "channel": "in.ekstep",
      "description": "New Delhi Follow 4 step Pedagogy Flow. Here is the description about the same.",
      "language": ["English"],
      "medium": "English",
      "mimeType": "application/vnd.ekstep.h5p-archive",
      "idealScreenSize": "normal",
      "createdOn": "2018-12-19T18:06:47.653+0000",
      "objectType": "Content",
      "gradeLevel": ["KG"],
      "appId": "local.sunbird.portal",
      "contentDisposition": "inline",
      "lastUpdatedOn": "2018-12-19T18:06:47.653+0000",
      "contentEncoding": "gzip",
      "pedagogySteps": "{\"step1\":\"Introduction\",\"step2\":\"Engagement\",\"step3\":\"Questioning\",\"step4\":\"Feedback\"}",
      "dialcodeRequired": "No",
      "contentType": "PedagogyFlow",
      "identifier": "do_21265862908030156813008",
      "audience": ["Learner"],
      "IL_SYS_NODE_TYPE": "DATA_NODE",
      "visibility": "Default",
      "os": ["All"],
      "consumerId": "4c4cc779-589b-4791-b810-22b79dd65ebd",
      "pedagogyStep": ["Introduction", "Engagement", "Questioning", "Feedback"],
      "mediaType": "content",
      "osId": "org.ekstep.quiz.app",
      "graph_id": "domain",
      "nodeType": "DATA_NODE",
      "versionKey": "1545242807653",
      "idealScreenDensity": "hdpi",
      "framework": "NCF",
      "createdBy": "54893ee2-961b-445a-9013-77afb3e9c83f",
      "compatibilityLevel": 1,
      "IL_FUNC_OBJECT_TYPE": "Content",
      "name": "Delhi Pedagogy Flow",
      "IL_UNIQUE_ID": "do_21265862908030156813008",
      "board": "CBSE",
      "status": "Draft",
      "node_id": 440827
    };
    console.log('padagogy', this.padagogyFlow);
    console.log('assasa', this.topicList);
  }

  addNewLessonPlan() {
    this.showStepSelection = true;
  }

  viewTopicConents(topic) {
    this.topicList.map((item) => {
      if (item.identifier === topic.identifier) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
  }
}

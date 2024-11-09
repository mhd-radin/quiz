const config = {
  firebaseConfig: {
    apiKey: "AIzaSyB_y27g51gE8HwwypZsRExzK8f0HsvEZ6U",
    authDomain: "bushido-2024.firebaseapp.com",
    projectId: "bushido-2024",
    storageBucket: "bushido-2024.appspot.com",
    messagingSenderId: "791522022722",
    appId: "1:791522022722:web:7ad2409049a3e9703a24db",
    measurementId: "G-PLQBR46HXP"
  }
}

const bushido = {
  loaded: false,
  sdk: null,
  db: null,
  firebaseApp: null,
  access() {
    var self = this;
    return new Promise((resolve, reject) => {
      if (bushido.db == null || bushido.loaded == false || !bushido.db) {
        var script = document.createElement("script");
        script.type = "module";
        script.textContent = `import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"
import * as fbfs from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

if (bushido){
  bushido.sdk = fbfs;
  const appfb = initializeApp(config.firebaseConfig);
  bushido.db = fbfs.getFirestore(appfb);
  bushido.firebaseApp = appfb;
  bushido.loaded = true;
  }`;

        var timer = setInterval(function() {
          if (bushido.loaded) {
            resolve();
            clearInterval(timer);
          }
        });

        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  },
  set(collection, data, opt) {
    return new Promise((resolve, reject) => {
      bushido.access().then(function() {
        data = typeof data == "function" ? data() : data;
        bushido.sdk
          .setDoc(bushido.sdk.doc(bushido.db, collection), data, opt)
          .then(resolve);
      });
    });
  },
  getCollection(collection) {
    return new Promise((resolve, reject) => {
      bushido.access().then(function() {
        bushido.sdk
          .getDocs(bushido.sdk.collection(bushido.db, collection))
          .then(resolve);
      });
    });
  },
  get(collection, name) {
    return new Promise((resolve, reject) => {
      bushido.access().then(function() {
        bushido.sdk
          .getDoc(bushido.sdk.doc(bushido.db, collection, name))
          .then(resolve);
      });
    });
  },
  useQuery(collectionName, where, orderBy = []) {
    return new Promise((resolve, reject) => {
      var wh = [];
      var ordBy = [];

      bushido.access().then(function() {
        where.forEach(function(item) {
          wh.push(bushido.sdk.where(item[0], item[1], item[2]));
        });

        orderBy.forEach(function(item) {
          ordBy.push(bushido.sdk.orderBy(item[0], item[1]));
        });

        bushido.sdk
          .getDocs(
            bushido.sdk.query(
              bushido.sdk.collection(bushido.db, collectionName),
              ...wh,
              ...ordBy
            )
          )
          .then(function(item) {
            resolve(item);
          });
      });
    });
  },
  onSet(ref, handle, type = "collection") {
    bushido.access().then(function() {
      var orgRef = bushido.sdk[type](bushido.db, ref);
      bushido.sdk.onSnapshot(orgRef, handle);
    });
  },
  toData(snapshot) {
    var data = [];
    snapshot.forEach(function(item) {
      data.push(item);
    });
    return data;
  },
  realtime: {
    inited: false,
    api: null,
    db: null,
    setup() {
      var self = this;
      return new Promise((resolve, reject) => {
        if (bushido.realtime.inited == false || bushido.realtime.api == null) {
          var script = document.createElement("script");
          script.type = "module";
          script.textContent = `
//import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"
import * as rt from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

if (bushido){
  bushido.realtime.api = rt;
  bushido.realtime.inited = true;
  bushido.realtime.db = rt.getDatabase(bushido.firebaseApp);
  }`;

          var timer = setInterval(function() {
            if (bushido.realtime.inited) {
              resolve();
              clearInterval(timer);
            }
          });

          document.head.appendChild(script);
        } else {
          resolve();
        }
      });
    },
    set(path, data) {
      return new Promise((resolve, reject) => {
        bushido.access().then(() => {
          bushido.realtime.setup().then(() => {
            const sdk = bushido.realtime.api;
            const db = bushido.realtime.db;

            var ref = sdk.ref(db, path);
            sdk.set(ref, (typeof data == 'function' ? data() : data)).then(resolve)
          })
        })
      })
    },
    get(path) {
      return new Promise((resolve, reject) => {
        bushido.access().then(() => {
          bushido.realtime.setup().then(() => {
            const sdk = bushido.realtime.api;
            const db = bushido.realtime.db;
            var ref = sdk.ref(db, path);

            sdk.get(ref).then(resolve)
          })
        })
      })
    },
    onSet(path, handler, opt = {}) {
      return new Promise((resolve, reject) => {
        bushido.access().then(() => {
          bushido.realtime.setup().then(() => {
            const sdk = bushido.realtime.api;
            const db = bushido.realtime.db;
            var ref = sdk.ref(db, path);

            sdk.onValue(ref, handler, opt)
          })
        })
      })
    },
    push(path, data) {
      return new Promise((resolve, reject) => {
        bushido.access().then(() => {
          bushido.realtime.setup().then(() => {
            const sdk = bushido.realtime.api;
            const db = bushido.realtime.db;
    
            var ref = sdk.ref(db, path);
            sdk.push(ref, (typeof data == 'function' ? data() : data)).then(resolve)
          })
        })
      })
    },
  }
};


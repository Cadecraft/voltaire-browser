 /*
 Hello, random person looking through this source code.
Im Cadecraft (find me at https://www.youtube.com/c/AwesomeCadecraft
or https://cadecraft.herokuapp.com )
Hows your day been?

Mine was good, ty for asking.

Oh btw you should check out this link https://www.youtube.com/watch?v=dQw4w9WgXcQ



Wondering how I made this browser?
I used Chrome Apps (documentation: https://developer.chrome.com/docs/apps/manifest/ )
This is an improved modification of the original Obscure 4 browser, so thanks a lot to m.boswell522 who made it.
You have my permission to modify this however you want to account for any new blocks the school imposes.

Wanna know why it is called the Voltaire browser? (hint: i took AP euro)
*/

/*
CHANGELOG
To add:
> Download permissions?
> Inspect Page

To test:
> Bookmarks system - finish testing
> Fullscreen permissions - finish testing
> Check that help img is correct size

Promotion:
> Main site - upload new ver
> Main site - "news" div - add new ver announcement
> Update discord svr message

Recently added:
> Bookmarks
> Help menu
> UI improvements
> Fullscreen permissions
*/

var globhomepg = 'https://google.com';
var bkmlist = [];

// Set status
function setstat(innew) {
  document.getElementById('status').innerText = 'Status: '+innew;
  console.log('Status set: '+innew);
}

function updatebkms() {
  try {
    while(document.getElementById('bkmlistbox').firstChild) {
      document.getElementById('bkmlistbox').removeChild(document.getElementById('bkmlistbox').firstChild);
    }
    for(let i = 0; i < bkmlist.length; i++) {
      let thisi = i;
      var trimmed = '';
      if(bkmlist[i].length >= 32) { trimmed = '...' }
      var thisspan = document.createElement('span');
      // old:
      // (button) onclick="bkmlist.splice('+i+', 1); updatebkms();
      // (a) onclick="document.getElementById(\'location\').value = \''+bkmlist[i]+'\'; document.getElementById(\'gobutton\').click();"
      thisspan.innerHTML = '&nbsp;<button id="bkmx-'+thisi+'">X</button>&nbsp;&nbsp;&nbsp;<a id="bkmlk-'+thisi+'">'+bkmlist[thisi].substr(0, 32)+trimmed+'</a>'
      var thisbr = document.createElement('br');
      document.getElementById('bkmlistbox').append(thisspan);
      document.getElementById('bkmlistbox').append(thisbr);
      // On clicks
      console.log('onclick value is = '+thisi);
      document.getElementById('bkmx-'+thisi).onclick = function() {
        bkmlist.splice(thisi, 1);
        updatebkms();
      }
      document.getElementById('bkmlk-'+thisi).onclick = function() {
        document.getElementById('location').value = bkmlist[thisi];
        document.getElementById('gobutton').click();
      }
    }
  }
  catch(err) {
    setstat('err attempting to update bkm');
  }
  // Update in storage
  try {
    chrome.storage.local.set({savebkmlist: bkmlist}, function() {
      // bkmlist set successfully
    });
  }
  catch(err) {
    // Error
    setstat('err setting local bkm storage val');
  }
}

var browser = (function(configModule, tabsModule) {
  var dce = function(str) { return document.createElement(str); };

  var Browser = function(
    controlsContainer,
    back,
    forward,
    home,
    reload,
    locationForm,
    locationBar,
    tabContainer,
    contentContainer,
    newTabElement) {
    this.controlsContainer = controlsContainer;
    this.back = back;
    this.forward = forward;
    this.reload = reload;
    this.home = home;
    this.locationForm = locationForm;
    this.locationBar = locationBar;
    this.tabContainer = tabContainer;
    this.contentContainer = contentContainer;
    this.newTabElement = newTabElement;
    this.tabs = new tabsModule.TabList(
        'tabs',
        this,
        tabContainer,
        contentContainer,
        newTabElement);

    this.init();
  };

  Browser.prototype.init = function() {
    // Get default settings from local storage
    try {
      chrome.storage.local.get(['homepg'], function(result) {
        // Obtain homepage if result is valid
        if(result.homepg != null && result.homepg.length > 0) {
          // Set homepage
          document.getElementById('def-homepg').value = result.homepg; // DBG: may have changed; try this.homepg instead of result.homepg
          globhomepg = result.homepg;
          // Navigate to homepage
          //this.tabs.selectIdx(0);
          //this.tabs.getSelected().navigateTo(globhomepg);
        }
      });
    }
    catch(err) {
      // Error
      setstat('err getting local storage vals');
    }
    try {
      chrome.storage.local.get(['savebkmlist'], function(result) {
        // Obtain bkm list if result is valid
        if(result.savebkmlist != null && result.savebkmlist.length > 0) {
          // Set bkm list
          bkmlist = result.savebkmlist;
          updatebkms();
        }
      });
    }
    catch(err) {
      setstat('err getting local bkm storage val');
    }

    (function(browser) {
      window.addEventListener('resize', function(e) {
        browser.doLayout(e);
      });

      window.addEventListener('keydown', function(e) {
        browser.doKeyDown(e);
      });

      browser.back.addEventListener('click', function(e) {
        browser.tabs.getSelected().goBack();
      });

      browser.forward.addEventListener('click', function() {
        browser.tabs.getSelected().goForward();
      });

      browser.home.addEventListener('click', function() {
        browser.tabs.getSelected().navigateTo('https://google.com'); // this is just search
      });
      document.getElementById('yt').addEventListener('click', function() {
        browser.tabs.getSelected().navigateTo('https://youtube.com');
      });
      document.getElementById('discord').addEventListener('click', function() {
        browser.tabs.getSelected().navigateTo('https://discord.com/app');
      });
      document.getElementById('remote').addEventListener('click', function() {
        browser.tabs.getSelected().navigateTo('https://remotedesktop.google.com/');
      })

      // Set browser name text with version (if not on chrome os version is '...') and settings menu
      var ver = '...';
      try {
        ver = chrome.runtime.getManifest().version;
      }
      catch(err) { }
      try {
        document.getElementById('br-name').innerHTML = 'VOLTAIRE BROWSER<br>v'+ver+' &#8226; <a id="mysite">My site</a>	&#8226; <a id="settings">Settings</a>	&#8226; <a id="help">Help</a>';
        // On click mysite
        document.getElementById('mysite').onclick = function() {
          browser.tabs.getSelected().navigateTo('https://cadecraft.herokuapp.com/');
        }
        // On click help
        document.getElementById('help').onclick = function() {
          // Toggle visibility of help box
          if(document.getElementById('helpbox').style.display == 'none') {
            document.getElementById('helpbox').style.display = 'inline'
          }
          else {
            document.getElementById('helpbox').style.display = 'none'
          }
        }
        // On click help X
        document.getElementById('helpclose').onclick = function() {
          document.getElementById('helpbox').style.display = 'none'
        }
        // On click settings
        document.getElementById('settings').onclick = function() {
          // Toggle visibility of settings box
          if(document.getElementById('settingsbox').style.display == 'none') {
            document.getElementById('settingsbox').style.display = 'inline'
            document.getElementById('helpbox').style.display = 'none' // Hide help to avoid overlap
          }
          else {
            document.getElementById('settingsbox').style.display = 'none'
          }
        }
        // On click settings X
        document.getElementById('settingsclose').onclick = function() {
          document.getElementById('settingsbox').style.display = 'none'
        }
        // On click inspect
        document.getElementById('inspect').onclick = function() {
          // Toggle visibility of inspect box
          if(document.getElementById('inspectbox').style.display == 'none') {
            document.getElementById('inspectbox').style.display = 'inline'
          }
          else {
            document.getElementById('inspectbox').style.display = 'none'
          }
        }
        // On click inspect X
        document.getElementById('inspectclose').onclick = function() {
          document.getElementById('inspectbox').style.display = 'none';
        }
        // On click bkm
        document.getElementById('bkm').onclick = function() {
          // Toggle visibility of bkm box
          if(document.getElementById('bkmbox').style.display == 'none') {
            document.getElementById('bkmbox').style.display = 'inline'
          }
          else {
            document.getElementById('bkmbox').style.display = 'none'
          }
        }
        // On click bkm X
        document.getElementById('bkmclose').onclick = function() {
          document.getElementById('bkmbox').style.display = 'none';
        }

        // On click links
        document.getElementById('lk-yt').onclick = function() {
          browser.tabs.getSelected().navigateTo('https://youtube.com/c/AwesomeCadecraft/');
        }
        document.getElementById('lk-site').onclick = function() {
          browser.tabs.getSelected().navigateTo('https://cadecraft.herokuapp.com/');
        }
        document.getElementById('lk-discord').onclick = function() {
          browser.tabs.getSelected().navigateTo('https://discord.gg/wahdQHBs4Z');
        }
        
        // On set settings
        document.getElementById('def-homepg').onchange = function() {
          var newhomepg = document.getElementById('def-homepg').value;
          if(!newhomepg.includes('http')) {
            document.getElementById('errtxt').innerText = 'Warning: the homepage should start with https://';
          }
          try {
            chrome.storage.local.set({homepg: newhomepg}, function() {
              // homepg set successfully
            });
          }
          catch(err) {
            // Error
            setstat('err setting local storage vals');
          }
          globhomepg = newhomepg;
        }
        document.getElementById('resetdata').onclick = function() {
          try {
            chrome.storage.local.clear(function() {
              // cleared successfully
            });
          }
          catch(err) {
            // Error
            setstat('err attempting to call clear datas');
          }
        }
        // Add bkm
        document.getElementById('addbkm').onclick = function() {
          var thisval = document.getElementById('location').value
          bkmlist.push(thisval);
          // Update bkms
          updatebkms();
        }
        // Bkm function (old)
        /*function bkmGo(goto) {
          browser.tabs.getSelected().navigateTo(goto);
        }*/
      }
      catch(err) { }

      browser.reload.addEventListener('click', function() {
        var tab = browser.tabs.getSelected();
        if (tab.isLoading()) {
          tab.stopNavigation();
        } else {
          tab.doReload();
        }
      });
      browser.reload.addEventListener(
        'webkitAnimationIteration',
        function() {
          // Between animation iterations: If loading is done, then stop spinning
          if (!browser.tabs.getSelected().isLoading()) {
            document.body.classList.remove('loading');
          }
        }
      );

      browser.locationForm.addEventListener('submit', function(e) {
        // On submit location
        e.preventDefault();
        // Determine whether is a direct address
        var isaddress = true;
        var googlesrch = '';
        if(browser.locationBar.value.substring(0, 4) == 'http' || browser.locationBar.value.length <= 0) { isaddress = true; }
        else {
          // Determine search URL
          isaddress = false;
          googlesrch = browser.locationBar.value;
          googlesrch = googlesrch.split(' ').join('+');
        }
        // Go to either address or google search
        if(isaddress) {
          browser.tabs.getSelected().navigateTo(browser.locationBar.value);
        }
        else {
          try {
            browser.tabs.getSelected().navigateTo('https://google.com/search?q='+googlesrch);
            //document.getElementById('status').innerText = 'Status: entered a non-url; redirected to google'
          }
          catch(err) {
            console.log('error while entering google search string: '+err)
          }
        }
      });

      browser.newTabElement.addEventListener(
        'click',
        function(e) { return browser.doNewTab(e); });

      window.addEventListener('message', function(e) {
        if (e.data) {
          var data = JSON.parse(e.data);
          if (data.name && data.title) {
            browser.tabs.setLabelByName(data.name, data.title);
          } else {
            console.warn(
                'Warning: Expected message from guest to contain {name, title}, but got:',
                data);
          }
        } else {
          console.warn('Warning: Message from guest contains no data');
        }
      });

      function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
      }      

      var webview = dce('webview');
      var tab = browser.tabs.append(webview);

      // Delay before setting in order to obtain correct homepage
      delay(500).then(function() {
        // Global window.newWindowEvent may be injected by opener
        if (window.newWindowEvent) {
          window.newWindowEvent.window.attach(webview);
        } else {
          tab.navigateTo(globhomepg);
        }
        browser.tabs.selectTab(tab);
      });
    }(this));
  };

  Browser.prototype.doLayout = function(e) {
    var controlsHeight = this.controlsContainer.offsetHeight;
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;
    var contentWidth = windowWidth;
    var contentHeight = windowHeight - controlsHeight;

    var tab = this.tabs.getSelected();
    var webview = tab.getWebview();
    var webviewContainer = tab.getWebviewContainer();

    var layoutElements = [
      this.contentContainer,
      webviewContainer,
      webview];
    for (var i = 0; i < layoutElements.length; ++i) {
      layoutElements[i].style.width = contentWidth + 'px';
      layoutElements[i].style.height = contentHeight + 'px';
    }
  };

  // New window that is NOT triggered by existing window
  Browser.prototype.doNewTab = function(e) {
    var tab = this.tabs.append(dce('webview'));
    tab.navigateTo(globhomepg); // this.myhomepg, document.getElementById('def-homepg').value
    this.tabs.selectTab(tab);
    return tab;
  };

  Browser.prototype.doKeyDown = function(e) {
    if (e.ctrlKey) {
      switch(e.keyCode) {
        // Ctrl+T
        case 84:
        this.doNewTab();
        break;
        // Ctrl+W
        case 87:
        e.preventDefault();
        this.tabs.removeTab(this.tabs.getSelected());
        break;
      }
      // Ctrl + [1-9]
      if (e.keyCode >= 49 && e.keyCode <= 57) {
        var idx = e.keyCode - 49;
        if (idx < this.tabs.getNumTabs()) {
          this.tabs.selectIdx(idx);
        }
      }
    }
  };

  Browser.prototype.doTabNavigating = function(tab, url) {
    if (tab.selected) {
      document.body.classList.add('loading');
      this.locationBar.value = url;
    }
  };

  Browser.prototype.doTabNavigated = function(tab, url) {
    this.updateControls();
  };

  Browser.prototype.doTabSwitch = function(oldTab, newTab) {
    this.updateControls();
  };

  Browser.prototype.updateControls = function() {
    var selectedTab = this.tabs.getSelected();
    if (selectedTab.isLoading()) {
      document.body.classList.add('loading');
    }
    var selectedWebview = selectedTab.getWebview();
    this.back.disabled = !selectedWebview.canGoBack();
    this.forward.disabled = !selectedWebview.canGoForward();
    if (this.locationBar.value != selectedTab.url) {
      this.locationBar.value = selectedTab.url;
    }
  };

  return {'Browser': Browser};
})(config, tabs);
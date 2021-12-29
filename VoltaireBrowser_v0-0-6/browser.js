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
To do:
> Fullscreen possibly?
> Download permissions?
*/

var globhomepg = 'https://google.com';

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
      document.getElementById('status').innerText = 'Status: err getting local storage vals'
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
        document.getElementById('br-name').innerHTML = 'VOLTAIRE BROWSER<br>v'+ver+' &#8226; <a id="mysite">My site</a>	&#8226; <a id="settings">Settings</a>';
        // On click mysite
        document.getElementById('mysite').onclick = function() {
          browser.tabs.getSelected().navigateTo('https://cadecraft.herokuapp.com/');
        }
        // On click settings
        document.getElementById('settings').onclick = function() {
          // Toggle visibility of settings box
          if(document.getElementById('settingsbox').style.display == 'none') {
            document.getElementById('settingsbox').style.display = 'inline'
          }
          else {
            document.getElementById('settingsbox').style.display = 'none'
          }
        }
        // On click settings X
        document.getElementById('settingsclose').onclick = function() {
          document.getElementById('settingsbox').style.display = 'none'
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
            document.getElementById('status').innerText = 'Status: err setting local storage vals'
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
            document.getElementById('status').innerText = 'Status: err attempting to call clear datas'
          }
        }
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
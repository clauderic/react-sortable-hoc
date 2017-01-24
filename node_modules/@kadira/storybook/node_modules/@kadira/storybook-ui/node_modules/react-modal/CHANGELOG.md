v1.4.0 - Thu, 30 Jun 2016 19:12:02 GMT
--------------------------------------

- [13bd46e](../../commit/13bd46e) [fixed] clear the delayed close timer when modal opens again. (#189)
- [70d91eb](../../commit/70d91eb) [fixed] Add missing envify npm dependency. Closes #193 (#194)


v1.3.0 - Tue, 17 May 2016 16:04:50 GMT
--------------------------------------

- [9089a2d](../../commit/9089a2d) [fixed] Make the modal portal render into body again (#176)


v1.2.1 - Sat, 23 Apr 2016 19:09:46 GMT
--------------------------------------

- [aa66819](../../commit/aa66819) [fixed] Removes unneeded sanitizeProps function (#169)


v1.2.0 - Thu, 21 Apr 2016 22:02:02 GMT
--------------------------------------

- [a10683a](../../commit/a10683a) [fixed] Make the non-minified dist build present again (#164)
- [04db149](../../commit/04db149) [added] Propagate event on close request (#91)


v1.1.2 - Tue, 19 Apr 2016 02:36:05 GMT
--------------------------------------

- [4509133](../../commit/4509133) [fixed] moved sanitizeProps out of the render calls. (#162)


v1.1.1 - Fri, 15 Apr 2016 05:30:45 GMT
--------------------------------------
This release affects only the dist version of the library reducing size immensely.

- [9823bc5](../../commit/9823bc5) Use -p flag in webpack for minification and exclude externals react and react-dom
- [72c8498](../../commit/72c8498) Move to using webpack for building the library


v1.1.0 - Tue, 12 Apr 2016 13:03:08 GMT
--------------------------------------

- [6c03d17](../../commit/6c03d17) [added] trigger onAfterOpen callback when available. (#154)


v1.0.0 - Sat, 09 Apr 2016 05:03:25 GMT
--------------------------------------

- [4e2447a](../../commit/4e2447a) [changed] Updated to add support for React 15  (#152)
- [0d4e600](../../commit/0d4e600) [added] module for default style
- [cb53bca](../../commit/cb53bca) [fixed] Remove ReactModal__Body--open class when unmounting Modal
- [63bee72](../../commit/63bee72) [fixed] Custom classnames override default styles


v0.6.1 - Fri, 23 Oct 2015 18:03:54 GMT
--------------------------------------

- 


v0.6.0 - Wed, 21 Oct 2015 21:39:48 GMT
--------------------------------------

- 


v0.5.0 - Tue, 22 Sep 2015 19:19:44 GMT
--------------------------------------

- [4d25989](../../commit/4d25989) [added] Inline CSS for modal and overlay as well as props to override. [changed] injectCSS has been changed to a warning message in preparation for a future removal. lib/components/Modal.js [changed] setAppElement method is now optional. Defaults to document.body and now allows for a css selector to be passed in rather than the whole element.
- [02cf2c3](../../commit/02cf2c3) [fixed] Clear the closeWithTimeout timer before unmounting


v0.3.0 - Wed, 15 Jul 2015 06:17:24 GMT
--------------------------------------

- [adecf62](../../commit/adecf62) [added] Class name on body when modal is open


v0.2.0 - Sat, 09 May 2015 05:16:40 GMT
--------------------------------------

- [f5fe537](../../commit/f5fe537) [added] Ability to specify style for the modal contents


v0.1.1 - Tue, 31 Mar 2015 15:56:47 GMT
--------------------------------------

- [f86de0a](../../commit/f86de0a) [fixed] shift+tab closes #23


v0.1.0 - Thu, 26 Feb 2015 17:14:27 GMT
--------------------------------------

- [1b8e2d0](../../commit/1b8e2d0) [fixed] ModalPortal's componentWillReceiveProps
- [28dbc63](../../commit/28dbc63) [added] Supporting custom overlay className closes #14
- [6626dae](../../commit/6626dae) [fixed] erroneous alias in webpack build


v0.0.7 - Sat, 03 Jan 2015 06:44:47 GMT
--------------------------------------

- 


v0.0.6 - Wed, 03 Dec 2014 21:24:45 GMT
--------------------------------------

- [28dbc63](../../commit/28dbc63) [added] Supporting custom overlay className closes #14
- [6626dae](../../commit/6626dae) [fixed] erroneous alias in webpack build


v0.0.5 - Thu, 13 Nov 2014 18:55:47 GMT
--------------------------------------

- [b15aa82](../../commit/b15aa82) [added] Supporting custom className
- [b7a38de](../../commit/b7a38de) [fixed] Warning caused by trying to focus null element closes #11


v0.0.4 - Tue, 11 Nov 2014 16:08:14 GMT
--------------------------------------

- [e57bab5](../../commit/e57bab5) [fixed] Issue with focus being lost - closes #9


v0.0.3 - Fri, 31 Oct 2014 19:25:20 GMT
--------------------------------------

- 


v0.0.2 - Thu, 25 Sep 2014 02:36:47 GMT
--------------------------------------

- 


v0.0.1 - Wed, 24 Sep 2014 22:26:40 GMT
--------------------------------------

- 


v0.0.0 - Wed, 24 Sep 2014 22:25:00 GMT
--------------------------------------

- 



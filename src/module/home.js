/**
 * Created by Jimmy on 2017/8/24.
 */
export default angular => {
    const ngHomeModule = angular.module('homeApp',[]);
    require('../sass/home.scss');
    require('../controller/home').default(ngHomeModule);
}
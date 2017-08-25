/**
 * Created by Jimmy on 2017/8/24.
 */
export default angular => {
    const ngBusinessModule = angular.module('businessApp',[]);
    require('../sass/business.scss');
    require('../controller/business').default(ngBusinessModule);
}
import Loading from '@/components/common/Loading.vue'
import NoResult from '@/components/common/noresult/NoResult'
import createDirective from './create-directive'

export const loadingDirective = createDirective(Loading)
export const noresultDirective = createDirective(NoResult)

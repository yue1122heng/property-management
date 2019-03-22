import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import User from './views/users/User.vue'
import Login from './views/users/Login.vue'
import UserSave from './views/users/UserSave.vue'
import ResetPassword from './views/users/ResetPassword.vue'
import Company from './views/companies/Company.vue'
import CompanySave from './views/companies/CompanySave.vue'
import Zone from './views/zones/Zone.vue'
import ZoneSave from './views/zones/ZoneSave.vue'
import Building from './views/buildings/Building.vue'
import BuildingSave from './views/buildings/BuildingSave.vue'
import House from './views/houses/House.vue'
import HouseSave from './views/houses/HouseSave.vue'
import Tenement from './views/tenements/Tenement.vue'
import TenementSave from './views/tenements/TenementSave.vue'
import Category from './views/categories/Category.vue'
import CategorySave from './views/categories/CategorySave.vue'
import Peripheral from './views/peripherals/Peripheral.vue'
import PeripheralSave from './views/peripherals/PeripheralSave.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'about',
          name: 'about',
          component: About
        },
        {
          path: 'user',
          name: 'user',
          component: User
        },
        {
          path: 'user-save',
          name: 'userSave',
          component: UserSave
        },
        {
          path: 'reset-password',
          name: 'resetPassword',
          component: ResetPassword
        },
        {
          path: 'company',
          name: 'company',
          component: Company
        },
        {
          path: 'company-save',
          name: 'companySave',
          component: CompanySave
        },
        {
          path: 'zone',
          name: 'zone',
          component: Zone
        },
        {
          path: 'zone-save',
          name: 'zoneSave',
          component: ZoneSave
        },
        {
          path: 'building',
          name: 'building',
          component: Building
        },
        {
          path: 'building-save',
          name: 'buildingSave',
          component: BuildingSave
        },
        {
          path: 'house',
          name: 'house',
          component: House
        },
        {
          path: 'house-save',
          name: 'houseSave',
          component: HouseSave
        },
        {
          path: 'tenement',
          name: 'tenement',
          component: Tenement
        },
        {
          path: 'tenement-save',
          name: 'tenementSave',
          component: TenementSave
        },
        {
          path: 'category',
          name: 'category',
          component: Category
        },
        {
          path: 'category-save',
          name: 'categorySave',
          component: CategorySave
        },
        {
          path: 'peripheral',
          name: 'peripheral',
          component: Peripheral
        },
        {
          path: 'peripheral-save',
          name: 'peripheralSave',
          component: PeripheralSave
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

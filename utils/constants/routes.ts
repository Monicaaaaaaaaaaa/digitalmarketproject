import type { RouteParams } from "vue-router";

export enum AppRoute {
  home = "/",
  about = "/about",
  vendors = "/vendors",
  contact = "/contact",
  vendorProfile = `${vendors}/profile`,
  profile = `/profile`,
}

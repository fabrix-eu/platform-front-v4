import type { ComponentType } from "react";
import type { ManualPage } from "../contents";
import { BringYourPartners } from "./BringYourPartners";
import { ClaimYourOrganisation } from "./ClaimYourOrganisation";
import { CompleteYourProfile } from "./CompleteYourProfile";
import { CreateAnAccount } from "./CreateAnAccount";
import { DeleteYourAccount } from "./DeleteYourAccount";
import { GettingStarted } from "./GettingStarted";
import { ManageNotifications } from "./ManageNotifications";
import { ResetYourPassword } from "./ResetYourPassword";
import { WhatYouDo } from "./WhatYouDo";
import { YourFirstListing } from "./YourFirstListing";
import { YourProfile } from "./YourProfile";

/**
 * The pages that are written. A page announced in the contents but absent here
 * opens on its summary and says the chapter is on its way.
 */
export const PAGES: Partial<Record<ManualPage, ComponentType>> = {
  "getting-started": GettingStarted,
  "your-first-listing": YourFirstListing,
  "bring-your-partners": BringYourPartners,
  "create-an-account": CreateAnAccount,
  "reset-your-password": ResetYourPassword,
  "manage-notifications": ManageNotifications,
  "delete-your-account": DeleteYourAccount,
  "claim-your-organisation": ClaimYourOrganisation,
  "complete-your-profile": CompleteYourProfile,
  "your-profile": YourProfile,
  "what-you-do": WhatYouDo,
};

export const isWritten = (page: ManualPage): boolean => page in PAGES;

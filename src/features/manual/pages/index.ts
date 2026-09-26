import type { ComponentType } from "react";
import type { ManualPage } from "../contents";
import { AddAnEvent } from "./AddAnEvent";
import { AddAPartner } from "./AddAPartner";
import { AttendAnEvent } from "./AttendAnEvent";
import { BringYourPartners } from "./BringYourPartners";
import { ClaimYourOrganisation } from "./ClaimYourOrganisation";
import { CompleteTheCompass } from "./CompleteTheCompass";
import { CompleteYourProfile } from "./CompleteYourProfile";
import { CreateAnAccount } from "./CreateAnAccount";
import { DeleteYourAccount } from "./DeleteYourAccount";
import { FindOrganisations } from "./FindOrganisations";
import { FollowAnOrganisation } from "./FollowAnOrganisation";
import { GettingStarted } from "./GettingStarted";
import { JoinAnOrganisation } from "./JoinAnOrganisation";
import { ListingFields } from "./ListingFields";
import { ManageNotifications } from "./ManageNotifications";
import { ManageYourListings } from "./ManageYourListings";
import { ManageYourTeam } from "./ManageYourTeam";
import { PublishAListing } from "./PublishAListing";
import { ResetYourPassword } from "./ResetYourPassword";
import { RolesAndPermissions } from "./RolesAndPermissions";
import { RunYourNetwork } from "./RunYourNetwork";
import { WhatYouDo } from "./WhatYouDo";
import { SearchTheMarketplace } from "./SearchTheMarketplace";
import { SendAMessage } from "./SendAMessage";
import { SendFeedback } from "./SendFeedback";
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
  "manage-your-team": ManageYourTeam,
  "join-an-organisation": JoinAnOrganisation,
  "publish-a-listing": PublishAListing,
  "manage-your-listings": ManageYourListings,
  "search-the-marketplace": SearchTheMarketplace,
  "add-an-event": AddAnEvent,
  "attend-an-event": AttendAnEvent,
  "find-organisations": FindOrganisations,
  "add-a-partner": AddAPartner,
  "send-a-message": SendAMessage,
  "complete-the-compass": CompleteTheCompass,
  "run-your-network": RunYourNetwork,
  "follow-an-organisation": FollowAnOrganisation,
  "send-feedback": SendFeedback,
  "roles-and-permissions": RolesAndPermissions,
  "listing-fields": ListingFields,
  "your-profile": YourProfile,
  "what-you-do": WhatYouDo,
};

export const isWritten = (page: ManualPage): boolean => page in PAGES;

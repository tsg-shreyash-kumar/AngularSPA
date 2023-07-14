import { Component, OnInit, Input } from "@angular/core";
import { ConstantsMaster } from "src/app/shared/constants/constantsMaster";
import { ProfileImageService } from "src/app/shared/services/profileImage.service";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-resource-overlay-header",
    templateUrl: "./resource-overlay-header.component.html",
    styleUrls: ["./resource-overlay-header.component.scss"],
    providers: [ProfileImageService]
})
export class ResourceOverlayHeaderComponent implements OnInit {
    shareUrl: string;
    @Input() resourceDetails: any;
    @Input() activeStaffableAsRoleName: any;
    timeInLevelInfo = ConstantsMaster.TimeInLevelDefination;
    accessibleFeatures = ConstantsMaster.appScreens.feature;

    constructor(private profileImageService: ProfileImageService) {}

    ngOnInit(): void {
        this.shareUrl = environment.settings.environmentUrl;
    }

    getImageUrl(resource) {
        this.profileImageService.getImage(resource.profileImageUrl);
        this.profileImageService.imgUrl.subscribe((imgUrl) => {
            this.resourceDetails.resource.profileImageUrl = imgUrl;
        });
    }

    getAffiliationImage(role) {
        if (role.toLowerCase().includes("connected")) {
            return "assets/img/Affiliations_1.svg";
        }
        if (role.toLowerCase().includes("l2")) {
            return "assets/img/Affiliations_2.svg";
        }
        if (role.toLowerCase().includes("l1")) {
            return "assets/img/Affiliations_3.svg";
        }
        return "assets/img/Affiliations_4.svg";
    }

    swapAffiliation(affiliationText) {
        if (affiliationText.indexOf("-") > -1) {
            const affiliationContent = affiliationText.split("-");
            return affiliationContent[1].trim() + " - " + affiliationContent[0].trim();
        }
        return affiliationText;
    }
}

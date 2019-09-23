import { BreadcrumbType } from "js/breadcrumbs/Breadcrumbs";
import { expect } from "chai";

describe("TestSuite", function() {
    it("check", function() {
        expect(BreadcrumbType.SAMPLE_TYPE).to.be.equal(
            BreadcrumbType.SAMPLE_TYPE
        );
    });
    it("check2", function() {
        expect(BreadcrumbType.SAMPLE_TYPE).to.be.equal("fails");
    });
});

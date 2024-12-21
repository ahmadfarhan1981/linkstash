
import {LinkstashUserRepository, UserPermissionsRepository} from '../../../repositories';
import {PermissionsService} from '../../../services';
import {StubbedInstanceWithSinonAccessor, createStubInstance} from '@loopback/testlab';
import {LinkstashUser, UserPermissions} from '../../../models';




describe("Permissions service", ()=>{
  let userRepository: StubbedInstanceWithSinonAccessor<LinkstashUserRepository>;
  let permissionsRepository: StubbedInstanceWithSinonAccessor<UserPermissionsRepository>;
  beforeEach(givenStubbedRepository);

  function givenStubbedRepository() {
    userRepository = createStubInstance(LinkstashUserRepository);
    permissionsRepository = createStubInstance(UserPermissionsRepository)
  }

  describe("Permissions services", ()=>{
    it("ALlows user admin to update permission", async ()=>{
    // TODO Disabled for now. Cannot stub a repository relation.
    //   const permissionsService = new PermissionsService(userRepository);
    //   userRepository.stubs.findOne.resolves(new LinkstashUser({
    //     username: "testUser",
    //     id: "aa40e033-2eb9-48a1-a280-d796d8c4d846",
    //     userPermissions :new UserPermissions({
    //       isUserAdmin: false,
    //       userId: "aa40e033-2eb9-48a1-a280-d796d8c4d846"
    //     })
    //   })
    // )
    // permissionsRepository.stubs.findOne.resolves(new UserPermissions({isUserAdmin:false, userId:"aa40e033-2eb9-48a1-a280-d796d8c4d846"}))

    // const admin = await permissionsService.isUserAdmin('aa40e033-2eb9-48a1-a280-d796d8c4d846')
    // console.log(admin)

    })
    it("DisaLlows non-admin to update permission")
    it("Allow user admin to see others' permissions")
    it("Disallow non-admin to see others' permission")
    it('Allows everyone to see their own permissions')
  })

}
)

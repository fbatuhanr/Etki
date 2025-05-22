import ManageEvent from '@/src/components/event/ManageEvent';
import { UserGuard } from '@/src/guards';

const Create = () => {
  return (
    <UserGuard>
      <ManageEvent />
    </UserGuard>
  );
}
export default Create;
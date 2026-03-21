-- Leave requester should be any authenticated user (teacher/student), not only student.
ALTER TABLE "leave_requests"
DROP CONSTRAINT IF EXISTS "leave_requests_requesterId_fkey";

ALTER TABLE "leave_requests"
ADD CONSTRAINT "leave_requests_requesterId_fkey"
FOREIGN KEY ("requesterId")
REFERENCES "users"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT VALID;

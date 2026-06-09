ALTER TABLE todo MODIFY COLUMN content VARCHAR(200);
ALTER TABLE user MODIFY COLUMN username VARCHAR(10);
ALTER TABLE user change COLUMN create_at create_time DATETIME;
alter table user change column update_at update_time datetime;

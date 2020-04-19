
--
-- SELECT QUERIES
--

SELECT p.pid, p.type, p.title, o.oid, o.title, o.date, o.notes, o.measurements, o.latitude, o.longitude from projects p inner join
observations o ON o.oid = p.pid
ORDER BY o.date;


SELECT p.pid, p.type, p.title, o.oid, o.title, o.date, o.notes, o.measurements, o.latitude, o.longitude from observations o inner join
projects p ON p.pid = o.project_id
ORDER BY o.date;

SELECT p.pid, p.type, p.title, o.oid, o.title, o.date, o.notes, o.measurements, o.latitude, o.longitude from observations o inner join
projects p ON p.pid = o.project_id
WHERE p.pid = 2
ORDER BY o.date;

SELECT p.pid, p.type, p.title, i.iid, i.file_name, i.file_type, i.file_path from projects p inner join
images i ON i.project = p.pid
WHERE p.pid = 2;

--
-- INSERT QUERIES
--


--
-- UPDATE QUERIES
--


--
-- DELETE QUERIES
--

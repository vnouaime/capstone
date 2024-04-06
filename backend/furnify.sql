\echo 'Delete and recreate furnify db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS furnify;
CREATE DATABASE furnify;
\connect furnify

\i furnify-schema.sql
\i furnify-seed.sql

\echo 'Delete and recreate furnify_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS furnify_test;
CREATE DATABASE furnify_test;
\connect furnify_test

\i furnify-schema.sql
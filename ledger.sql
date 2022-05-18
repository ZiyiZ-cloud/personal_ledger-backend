\echo 'Delete and recreate jobly db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE expense_tracker;
CREATE DATABASE expense_tracker;
\connect expense_tracker

\i ledger-schema.sql
\i ledger-seed.sql

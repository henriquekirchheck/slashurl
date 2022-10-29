// @generated automatically by Diesel CLI.

diesel::table! {
    urls (id) {
        id -> Int4,
        short_url -> Varchar,
        full_url -> Varchar,
        visits -> Int4,
        created_at -> Timestamp,
    }
}

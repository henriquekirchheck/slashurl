use dotenv;

fn main() {
    dotenv::from_filename(".env.dev").ok();
    slashurl_api::main();
}

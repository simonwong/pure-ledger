use objc::runtime::{Class, Object};
use objc::{msg_send, sel, sel_impl};

pub fn is_icloud_drive_enabled() -> bool {
    unsafe {
        let file_manager_class =
            Class::get("NSFileManager").expect("NSFileManager class not found");
        let file_manager: *mut Object = msg_send![file_manager_class, defaultManager];

        let ubiquity_identity_token: *mut Object = msg_send![file_manager, ubiquityIdentityToken];

        // 如果 ubiquityIdentityToken 非空，则 iCloud Drive 已启用
        !ubiquity_identity_token.is_null()
    }
}

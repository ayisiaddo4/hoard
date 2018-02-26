//
//  JMUIController.h
//
//  Copyright © 2016 Jumio Corporation All rights reserved.
//

#import <Foundation/Foundation.h>

@class JMStateMachine;

__attribute__((visibility("default"))) @interface JMUIController : NSObject

@property (nonatomic, strong, readonly) JMStateMachine*     stateMachine;

- (void) takeOverControl;

- (void)initStateMachine;
- (void)initUI;
- (void)initData;

@end

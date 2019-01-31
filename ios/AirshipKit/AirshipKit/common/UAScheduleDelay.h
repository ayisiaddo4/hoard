/* Copyright 2010-2019 Urban Airship and Contributors */

#import <Foundation/Foundation.h>
#import "UAScheduleTrigger.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Represents the possible error conditions when deserializing a schedule delay from JSON.
 */
typedef NS_ENUM(NSInteger, UAScheduleDelayErrorCode) {
    /**
     * Indicates an error with the schedule delay JSON definition.
     */
    UAScheduleDelayErrorCodeInvalidJSON,
};

/**
 * The domain for NSErrors generated by `delayWithJSON:error:`.
 */
extern NSString * const UAScheduleDelayErrorDomain;

/**
 * JSON key for the seconds delay condition.
 */
extern NSString *const UAScheduleDelaySecondsKey;

/**
 * JSON key delay's region ID condition.
 */
extern NSString *const UAScheduleDelayRegionKey;

/**
 * JSON key delay's screen names condition.
 */
extern NSString *const UAScheduleDelayScreensKey;

/**
 * JSON key for the cancellation triggers.
 */
extern NSString *const UAScheduleDelayCancellationTriggersKey;

/**
 * JSON key for the app state condition.
 */
extern NSString *const UAScheduleDelayAppStateKey;

/**
 * JSON name for the foreground app state condition.
 */
extern NSString *const UAScheduleDelayAppStateForegroundName;

/**
 * JSON name for the background app state condition.
 */
extern NSString *const UAScheduleDelayAppStateBackgroundName;

/**
 * Max number of cancellation triggers a delay can support.
 */
extern NSUInteger const UAScheduleDelayMaxCancellationTriggers;

/**
 * Enum for defining an app state condition.
 */
typedef NS_ENUM(NSInteger, UAScheduleDelayAppState) {

    /**
     * Any app state.
     */
    UAScheduleDelayAppStateAny,

    /**
     * Requires application to be in the foreground.
     */
    UAScheduleDelayAppStateForeground,

    /**
     * Requires application to be in the background.
     */
    UAScheduleDelayAppStateBackground
};

/**
 * Builder class for UAScheduleDelay.
 */
@interface UAScheduleDelayBuilder : NSObject

///---------------------------------------------------------------------------------------
/// @name Schedule Delay Builder Properties
///---------------------------------------------------------------------------------------

/**
 * Minimum amount of time to wait in seconds before the schedule actions are able to execute.
 */
@property(nonatomic, assign) NSTimeInterval seconds;

/**
 * Specifies the names of the app screens that will trigger the schedule's actions if viewed.
 * Specifying screens requires the application to make use of UAAnalytic's screen tracking method `trackScreen:`.
 */
@property(nonatomic, copy) NSArray *screens;

/**
 * Specifies the ID of a region that the device must currently be in before the schedule's
 * actions are able to be executed. Specifying regions requires the application to add UARegionEvents
 * to UAAnalytics.
 */
@property(nonatomic, copy) NSString *regionID;

/**
 * Specifies the app state that is required before the schedule's actions are able to execute.
 * Defaults to `UAScheduleDelayAppStateAny`.
 */
@property(nonatomic, assign) UAScheduleDelayAppState appState;

/**
 * Array of cancellation triggers. Cancellation triggers define conditions on when to cancel the
 * pending execution of schedule's actions. If the delayed execution is cancelled, it will not
 * cancel the schedule or count against the schedule's limit.
 */
@property(nonatomic, copy) NSArray<UAScheduleTrigger *> *cancellationTriggers;

@end


/**
 * A delay defines an amount of time and/or app conditions that must be met before the actions
 * are able to be executed. The delay occurs after one of the triggers hits its goals.
 */
@interface UAScheduleDelay: NSObject

///---------------------------------------------------------------------------------------
/// @name Schedule Delay Properties
///---------------------------------------------------------------------------------------

/**
 * Checks if the delay is valid. A valid delay must contain at
 * most 10 cancellation triggers.
 */
@property(nonatomic, readonly) BOOL isValid;

/**
 * Minimum amount of time to wait in seconds before the schedule actions are able to execute.
 */
@property(nonatomic, readonly) NSTimeInterval seconds;

/**
 * Specifies the names of the app screens that will trigger the schedule's actions if viewed.
 * Specifying screens requires the application to make use of UAAnalytic's screen tracking method `trackScreen:`.
 */
@property(nonatomic, readonly) NSArray *screens;

/**
 * Specifies the ID of a region that the device must currently be in before the schedule's
 * actions are able to be executed. Specifying regions requires the application to add UARegionEvents
 * to UAAnalytics.
 */
@property(nonatomic, readonly) NSString *regionID;

/**
 * Specifies the app state that is required before the schedule's actions are able to execute.
 * Defaults to `UAScheduleDelayAppStateAny`.
 */
@property(nonatomic, readonly) UAScheduleDelayAppState appState;

/**
 * Array of cancellation triggers. Cancellation triggers define conditions on when to cancel the
 * pending execution of schedule's actions. If the delayed execution is cancelled, it will not
 * cancel the schedule or count against the schedule's limit.
 */
@property(nonatomic, readonly) NSArray<UAScheduleTrigger *> *cancellationTriggers;

///---------------------------------------------------------------------------------------
/// @name Schedule Delay Factories
///---------------------------------------------------------------------------------------

/**
 * Creates a schedule delay with a builder block.
 *
 * @return A UAScheduleDelay instance.
 */
+ (instancetype)delayWithBuilderBlock:(void (^)(UAScheduleDelayBuilder *))builderBlock;

/**
 * Factory method to create a schedule delay from a JSON payload.
 *
 * @param json The JSON payload.
 * @param error An NSError pointer for storing errors, if applicable.
 * @return A UAScheduleDelay instance or `nil` if the JSON is invalid.
 */
+ (nullable instancetype)delayWithJSON:(id)json error:(NSError * _Nullable *)error;

///---------------------------------------------------------------------------------------
/// @name Schedule Delay Evaluation
///---------------------------------------------------------------------------------------

/**
 * Checks if the delay is equal to another delay.
 *
 * @param delay The other delay to compare against.
 * @return `YES` if the delays are equal, otherwise `NO`.
 */
- (BOOL)isEqualToDelay:(nullable UAScheduleDelay *)delay;


@end

NS_ASSUME_NONNULL_END


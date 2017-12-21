package com.vue.admin.tools;

import com.vue.admin.entity.PerfData;

import java.lang.reflect.Method;
import java.util.*;

public class CommonUtils {
    public static boolean isEmpty(List<?> list) {
        return list == null || list.size() == 0;
    }

    public static String getUUID() {
        return UUID.randomUUID().toString();
    }

    private static boolean isCollectionEmpty(Collection<?> collection) {
        if (collection == null || collection.isEmpty()) {
            return true;
        }
        return false;
    }

    public static boolean isObjectEmpty(Object object) {
        if (object == null) {
            return true;
        } else if (object instanceof String) {
            if (((String) object).trim().length() == 0) {
                return true;
            }
        } else if (object instanceof Collection) {
            return isCollectionEmpty((Collection<?>) object);
        }
        return false;
    }

    // 获取今晨零点

    // 获取当前时刻

    public static String getValueByType(PerfData perfData, String type) {
        Class perfClass = perfData.getClass();
        String value = null;
        Method[] methods = perfClass.getMethods();
        for (int i = 0; i < methods.length; i++) {
            Method method = methods[i];
            String methodName = method.getName();
            if (methodName.startsWith("get") && methodName.toUpperCase().contains(type.toUpperCase())) {
                try {
                    value = Double.toString((Double) method.invoke(perfData));
                    break;
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return value;
    }

    public static List<String> addValueToList(Collection<String> timeLine, Map<String, String> map, List<String> list) {
        for (String timePoint : timeLine) {
            String value = map.get(timePoint);
            if (value == null) {
                value = "--";
            }
            list.add(value);
        }
        return list;
    }

    public static List<String> addMultipleValueToList(Collection<String> deviceList, Map<String, String> map, String collectTime) {
        List<String> valueList = new ArrayList<>();
        valueList.add("");
        valueList.add(collectTime);
        valueList = addValueToList(deviceList, map, valueList);
        return valueList;
    }
}

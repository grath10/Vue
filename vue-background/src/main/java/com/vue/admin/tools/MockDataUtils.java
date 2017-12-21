package com.vue.admin.tools;

import com.vue.admin.entity.CollectData;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class MockDataUtils {
    private static Random random = new Random();

    public static List<CollectData> mockHistoryData(String type, String device) {
        List<CollectData> dataList = new ArrayList<>();
        int base = 100;
        if ("氨气".equals(type)) {
            base = 1;
        }
        for (int i = 0; i < 24; i++) {
            CollectData data = new CollectData();
            data.setType(type);
            data.setCollecttime("" + i);
            double avg = random.nextDouble() * base;
            data.setValueAvg(Math.round(avg));
            data.setValueMax(Math.round(avg + 3));
            data.setValueMin(Math.round(Math.abs(avg - 2)));
            dataList.add(data);
        }
        return dataList;
    }

    public static List<List<String>> mockWholeHistoryData(String device) {
        List<List<String>> dataList = new ArrayList<>();
        for (int i = 0; i < 24; i++) {
            List<String> oneTimeList = new ArrayList<>();
            oneTimeList.add(i + "");
            oneTimeList.add(i + "");
            double tempAvg = random.nextDouble() * 100;
            oneTimeList.add(String.format("%.2f", tempAvg));
            oneTimeList.add(String.format("%.2f", Math.abs(tempAvg - 2)));
            oneTimeList.add(String.format("%.2f", tempAvg + 3));
            double humAvg = random.nextDouble() * 100;
            oneTimeList.add(String.format("%.2f", humAvg));
            oneTimeList.add(String.format("%.2f", Math.abs(humAvg - 2)));
            oneTimeList.add(String.format("%.2f", humAvg + 3));
            double gasAvg = random.nextDouble() * 1;
            oneTimeList.add(String.format("%.2f", gasAvg));
            oneTimeList.add(String.format("%.2f", Math.abs(gasAvg - 0.2)));
            oneTimeList.add(String.format("%.2f", gasAvg + 0.3));
            dataList.add(oneTimeList);
        }
        return dataList;
    }
}
